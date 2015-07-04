<?php
namespace OwnDrive\Services;

use Crypt;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Filesystem\Factory;
//use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory as Response;
use Illuminate\Foundation\Bus\DispatchesCommands;
use League\Flysystem\Exception;
use League\Flysystem\FileExistsException;
use OwnDrive\Commands\HandleErrorCommand;
use OwnDrive\Commands\HandleResponseCommand;
use OwnDrive\Download;
use OwnDrive\File;
use OwnDrive\Group;
use OwnDrive\User;
use Session;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileService
{

    use DispatchesCommands;

    /**
     * @var \Illuminate\Contracts\Filesystem\Filesystem
     */
    private $disk;
    /**
     * @var User
     */
    private $user;
    /**
     * @var Group
     */
    private $group;
    /**
     * @var File
     */
    private $file;
    /**
     * @var Guard
     */
    private $auth;
    /**
     * @var Response|Response
     */
    private $response;
    /**
     * @var Download
     */
    private $download;

    /**
     * @param Factory $storage
     * @param User $user
     * @param Group $group
     * @param File $file
     * @param Download $download
     * @param Guard $auth
     * @param Response $response
     */
    function __construct(Factory $storage, User $user, Group $group, File $file, Download $download, Guard $auth, Response $response)
    {
        $this->disk = $storage->disk('local');
        $this->user = $user;
        $this->group = $group;
        $this->file = $file;
        $this->auth = $auth;
        $this->response = $response;
        $this->download = $download;
    }


    /**
     * @param $query
     */
    public function search($query){
        $userId = $this->auth->id();
        return File::where('owner_id', '=', $userId)->search($query)->get();
    }

    /**
     * @param int||null $userId
     * @param int||null $fileId
     * @return array
     */
    public function listFilesById($parentId = null, $userId = null)
    {

        if ($userId === null) {
            $userId = $this->auth->id();

            if($this->isSharedFile($parentId)){
                $userId = $this->file->find($parentId)->get('owner_id');
            }
        }

        //Set directory as user root if null
        if ($parentId) {
            $parentPath = $this->file->find($parentId)->path . $this->file->find($parentId)->name . '/';
        } else {
            $parentPath = '/';
        }

        return $this->listFiles($userId, $parentPath);


    }


    /**
     * @param null||string $path
     * @param null||int $userId
     * @return array
     */
    public function listFilesByPath($path = null, $userId = null)
    {


        if($userId){

            $fileName = basename($path);
            $parentPath = str_replace($fileName, '', $path);
            $parentPath = $this->pathProcessor(null, $parentPath, true, $userId);
            $parentPath = $parentPath ? $parentPath : '/';
            $path = $this->pathProcessor(null, $path, true, $userId);


            $parentId = $this->user->find($userId)->files()->where('path', '=', $parentPath)->where('name', '=', $fileName)->get(['id'])->toArray();
            $parentId = array_pop($parentId);

                if($this->isSharedFile($parentId['id'])){
                    return $this->listFiles($userId, $path, true);
                } else {
                    return $this->dispatch(new HandleErrorCommand("You don't Have access to that file."));
                }

        } elseif($userId === null) {

            $userId = $this->auth->id();
            $parentPath = $this->pathProcessor(null, $path);
            return $this->listFiles($userId, $parentPath);

        }

    }


    /**
     * @param null $userId
     * @return mixed
     */
    public function getTrashedFiles($userId = null)
    {
        $userId = $userId ? $userId : $this->auth->id();

        $result = $this->file->where('owner_id', '=', $userId)->where('trashed', '=', '1')->get();
        return $result;
    }

    /**
     * @param null $userId
     * @return mixed
     */
    public function getFavoriteFiles($userId = null)
    {
        $userId = $userId ? $userId : $this->auth->id();

        $result = $this->file->where('owner_id', '=', $userId)->where('starred', '=', '1')->get();
        return $this->appendShareStatus($result);
    }

    /**
     * @param null $userId
     * @return mixed
     */
    public function getRecentFiles($userId = null)
    {
        $userId = $userId ? $userId : $this->auth->id();

        $result = $this->file->where('owner_id', '=', $userId)->get()->sortByDesc('updated_at')->take(10);
        return $this->appendShareStatus($result);
    }

    public function getFilesSharedWith($ownerId = null,  $parentId = null, $path = null)
    {
        $userId = $ownerId ? $ownerId : $this->auth->id();

        if($parentId){
            return $this->listFilesById($parentId);
        } elseif($path && $path!=='/'){
            return $this->listFilesByPath($path, $userId);
        } else {
            $result = $this->user->find($userId)->filesSharedWith;
            return $result;
        }
    }


    /**
     * @param UploadedFile $file
     * @param string||null $path
     * @param string||null $id
     * @return bool|\Exception
     */
    public function putFile($file, $path = null, $parentId = null)
    {

        $path = $this->pathProcessor($parentId, $path);

        $record = $this->file->create([
            'owner_id' => $this->auth->id(),
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => 'file',
            'mime' => $file->getMimeType(),
            'size' => $file->getSize()
        ]);


        try {
            if (\Storage::disk('local')->put($this->auth->id() . $record->path . $record->name, \File::get($file))) {
                return $this->dispatch(new HandleResponseCommand($record->name . ' Uploaded'));
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $this->dispatch(new HandleResponseCommand($record->name . ' Uploaded'));
    }


    /**
     * @param string $directoryName
     * @param string $path
     * @param null $parentId
     * @param bool $httpResponse
     * @return bool|\Exception
     */
    public function createDirectory($directoryName, $path = null, $parentId = null, $httpResponse = true)
    {

        $dirPath = $this->pathProcessor($parentId, $path);

        if (preg_match('/\//', $directoryName)) {
            if ($httpResponse) {
                return $this->dispatch(new HandleErrorCommand('Invalid directory name'));
            } else {
                return false;
            }
        };

        $subDirectories = $this->disk->directories($this->auth->id() . $dirPath);
        foreach ($subDirectories as $subDirectory) {
            if (basename($subDirectory) === $directoryName) {
                if ($httpResponse) {
                    return $this->dispatch(new HandleErrorCommand('A directory with the same name already exists'));
                } else {
                    return false;
                }
            }
        }

        try {
            $this->disk->makeDirectory($this->auth->id() . $dirPath . $directoryName);

        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        $this->file->create([
            'owner_id' => $this->auth->id(),
            'name' => $directoryName,
            'type' => 'folder',
            'path' => $dirPath
        ]);

        if ($httpResponse) {
            return $this->dispatch(new HandleResponseCommand('Directory created.'));
        } else {
            return true;
        }
    }


    /**
     * @param int $fileId
     * @param string $newName
     * @return array
     */
    public function renameFile($fileId, $newName)
    {
        $file = $this->file->find($fileId);

        $currentPath = $file->path;
        $currentName = $file->name;


        //$newPath = $this->pathProcessor();

        if ($file->type === 'file') {
            try {
                $this->fileMover($currentPath, $currentName, $currentPath, $newName);
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $item = 'File';

        } elseif ($file->type === 'folder') {

            $subDirectories = $this->disk->directories($this->auth->id() . $currentPath);
            foreach ($subDirectories as $subDirectory) {
                if ($currentName === $newName) {
                    return $this->dispatch(new HandleResponseCommand('Directory renamed.'));
                } elseif (basename($subDirectory) === $newName) {
                    return $this->dispatch(new HandleErrorCommand('A directory with the same name already exists'));
                }
            }

            try {
                if ($this->directoryMover($currentPath, $currentName, $currentPath, $newName)) {
                }
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $this->deleteFile($fileId, false);

            $item = 'Directory';
        }

        return $this->dispatch(new HandleResponseCommand($item . ' renamed.'));

    }


    /**
     * @param string $fileId
     * @param string $newPath
     *
     * @return array
     */
    public function copyFile($fileId, $newPath)
    {

        $file = $this->file->find($fileId);

        $currentPath = $file->path;
        $currentName = $file->name;
        //$newPath = $this->pathProcessor();

        if ($currentPath === $this->pathProcessor(null, $newPath)) {

            return $this->dispatch(new HandleErrorCommand('Source and destinations are same'));

        } elseif ($file->type === 'file') {

            try {
                $this->fileCopier($currentPath, $currentName, $newPath);
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $item = 'File';

        } elseif ($file->type === 'folder') {

            try {
                if ($this->directoryCopier($currentPath, $currentName, $newPath)) {
                }
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $item = 'Directory';
        }

        return $this->dispatch(new HandleResponseCommand($item . ' copied.'));

    }


    /**
     * @param int $fileId
     * @param string $newPath
     * @return mixed
     */
    public function moveFile($fileId, $newPath)
    {

        $file = $this->file->find($fileId);

        $currentPath = $file->path;
        $currentName = $file->name;
        //$newPath = $this->pathProcessor();

        if ($currentPath === $this->pathProcessor(null, $newPath)) {

            return $this->dispatch(new HandleErrorCommand('Source and destinations are same'));

        } elseif ($file->type === 'file') {

            try {
                $this->fileMover($currentPath, $currentName, $newPath);
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $item = 'File';

        } elseif ($file->type === 'folder') {

            try {
                if ($this->directoryMover($currentPath, $currentName, $newPath)) {
                }
            } catch (\Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $this->deleteFile($fileId, false);

            $item = 'Directory';
        }

        return $this->dispatch(new HandleResponseCommand($item . ' moved.'));
    }


    /**
     * @param $fileId
     * @return mixed
     */
    public function trashFile($fileId)
    {

        try {
            $file = $this->file->find($fileId);
            $file->trashed = 1;
            $file->save();

            $item = '';
            if ($file->type === 'file') {
                $item = 'File';
            } elseif ($file->type === 'folder') {
                $item = 'Directory';
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $this->dispatch(new HandleResponseCommand($item . ' moved to trash'));

    }

    /**
     * @param $fileId
     * @return mixed
     */
    public function restoreFile($fileId)
    {
        try {
            $file = $this->file->find($fileId);
            $file->trashed = 0;
            $file->save();

            $item = '';
            if ($file->type === 'file') {
                $item = 'File';
            } elseif ($file->type === 'folder') {
                $item = 'Directory';
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $this->dispatch(new HandleResponseCommand($item . ' restored.'));
    }


    /**
     * @param $fileId
     * @param bool $httpResponse
     * @return bool
     * @throws \Exception
     */
    public function deleteFile($fileId, $httpResponse = true)
    {
        $file = $this->file->find($fileId);

        $path = $file->path . $file->name . '/';
        $realPath = $this->auth->id() . $path;
        $item = '';

        try {

            if ($file->type === 'file') {
                if ($this->disk->delete($realPath)) {
                    $file->delete();
                }

                $item = 'File';

            } elseif ($file->type === 'folder') {

                if ($this->disk->deleteDirectory($realPath)) {
                    $this->file->where('owner_id', '=', $this->auth->id())->where('path', 'like', $path . '%')->delete();
                    $file->delete();
                }

                $item = 'Directory';
            }


        } catch (\Exception $e) {
            if ($httpResponse) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            } else {
                throw $e;
            }
        }

        if ($httpResponse) {
            return $this->dispatch(new HandleResponseCommand($item . ' deleted'));
        } else {
            return true;
        }
    }


    /**
     * @param $fileId
     * @return mixed
     */
    public function addFavorites($fileId)
    {
        try {
            $file = $this->file->find($fileId);
            $file->starred = 1;
            $file->save();

            $item = '';
            if ($file->type === 'file') {
                $item = 'File';
            } elseif ($file->type === 'folder') {
                $item = 'Directory';
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $this->dispatch(new HandleResponseCommand($item . ' added to favorites.'));
    }


    /**
     * @param $fileId
     * @return mixed
     */
    public function removeFavorites($fileId)
    {
        try {
            $file = $this->file->find($fileId);
            $file->starred = 0;
            $file->save();

            $item = '';
            if ($file->type === 'file') {
                $item = 'File';
            } elseif ($file->type === 'folder') {
                $item = 'Directory';
            }
        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return $this->dispatch(new HandleResponseCommand($item . ' removed from favorites.'));
    }


    /**
     * @param $key
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function downloadFile($key)
    {
        //return $key;
        $key = Crypt::decrypt($key);
        // return $key;


        if ($this->download->where('key', '=', $key)->first()) {

            $dbItem = $this->download->where('key', '=', $key)->first();
            $fileId = $dbItem['file_id'];
            //return $fileId;

            $file = $this->file->find($fileId);


            $path = str_replace('\\', '/', storage_path()) . '/app/' . $file->owner_id . $this->pathProcessor($fileId);
            $response = $this->response->download($path, $file->name, ["Content-Disposition" => "attachment", "filename" => $file->name]);
            ob_end_clean();
            return $response;
        }
    }
// "Content-type" => "force-download",
//  , "Transfer-Encoding" => "chunked"


    /**
     * @param $fileId
     * @return mixed
     */
    public function getDownloadUrl($fileId)
    {
        $key = str_random(16);
        $downloadKey = Crypt::encrypt($key);
        $file = $this->file->find($fileId);


        if ($file->isOwnerId($this->auth->id()) || $this->isSharedFile($fileId)) {

            if ($this->download->where('file_id', '=', $fileId)->first()) {
                $this->download->where('file_id', '=', $fileId)->first()->delete();
            }

            $this->download->create([
                'file_id' => $fileId,
                'key' => $key
            ]);

            return $this->response->json([
                'key' => $downloadKey
            ], 200);
        }

        return $this->dispatch(new HandleErrorCommand('Invalid File'));
    }



    /**
     * @param $fileId
     * @param $shareUserIds
     * @param $unshareUserIds
     * @return mixed
     */
    public function fileShareManager($fileId, $shareUserIds = null, $unshareUserIds = null)
    {
        $file = $this->file->find($fileId);

        if ($file->type === 'file') {

            try {
                $shareFile = $this->shareFile($fileId, $shareUserIds, true);
                $removeShareFile = $this->removeShareFile($fileId, $unshareUserIds, true);
            } catch (Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }

            $item = 'File';
        } elseif ($file->type === 'folder') {

            $childrenPath = $file->path . $file->name;

            try {
                $shareFile = $this->shareFile($fileId, $shareUserIds, true);
                $removeShareFile = $this->removeShareFile($fileId, $unshareUserIds, true);


                $children = $this->file->where('owner_id', '=', $this->auth->id())->where('path', 'like', $childrenPath . '%')->get(['id'])->toArray();


                foreach($children as $child){
                    $fileId = $child['id'];
                    $shareFile = $this->shareFile($fileId, $shareUserIds, true, true);
                    $removeShareFile = $this->removeShareFile($fileId, $unshareUserIds, true);
                }



            } catch (Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }


            $item = 'Directory';
        }





        if ($shareFile && $removeShareFile) {
            return $this->dispatch(new HandleResponseCommand($item . ' shared successfully'));
        } else {
            return $this->dispatch(new HandleErrorCommand('Invalid File'));
        }
    }


    /**
     * @param $fileId
     * @param $userIds
     * @param bool $noResponse
     * @throws Exception
     * @throws \Exception
     * @return mixed
     */
    public function shareFile($fileId, $userIds = null, $noResponse = false, $child = false)
    {
        $file = $this->file->find($fileId);

        if ($file->isOwnerId($this->auth->id())) {
            if ($userIds) {
                foreach ($userIds as $userId) {

                    $sharedUsers = $file->sharedWith()->get(['user_id'])->toArray();

                    $attach = true;
                    foreach ($sharedUsers as $sharedUser) {
                        if ($sharedUser['user_id'] === $userId) {
                            $attach = false;
                            break;
                        }
                    }

                    if ($attach) {

                        try {
                            if($child){
                                $file->sharedWith()->attach($userId, ['child' => 1]);
                            } elseif (!$child){
                                $file->sharedWith()->attach($userId);
                            }
                        } catch (Exception $e) {
                            if (!$noResponse) {
                                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
                            } else {
                                throw $e;
                            }
                        }
                    }
                }
            }


            if (!$noResponse) {
                if ($file->type === 'file') {
                    $item = 'File';
                } elseif ($file->type === 'folder') {
                    $item = 'Directory';
                }

                //$sharedWith = $this->user->find($userId);
                return $this->dispatch(new HandleResponseCommand($item . ' shared successfully.'));
            } else {
                return true;
            }
        } else {
            if (!$noResponse) {
                return $this->dispatch(new HandleErrorCommand('Invalid File'));
            } else {
                return false;
            }
        }
    }


    /**
     * @param $fileId
     * @param $userIds
     * @param bool $noResponse
     * @throws Exception
     * @throws \Exception
     * @return mixed
     */
    public function removeShareFile($fileId, $userIds = null, $noResponse = false)
    {
        $file = $this->file->find($fileId);

        if ($file->isOwnerId($this->auth->id())) {
            if ($userIds) {
                foreach ($userIds as $userId) {
                    try {
                        $file->sharedWith()->detach($userId);
                    } catch (Exception $e) {
                        if (!$noResponse) {
                            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
                        } else {
                            throw $e;
                        }
                    }
                }
            }
            if (!$noResponse) {
                if ($file->type === 'file') {
                    $item = 'File';
                } elseif ($file->type === 'folder') {
                    $item = 'Directory';
                }
                $sharedWith = $this->user->find($userId);
                return $this->dispatch(new HandleResponseCommand($item . ' unshared successfully'));
            } else {
                return true;
            }
        } else {
            if (!$noResponse) {
                return $this->dispatch(new HandleErrorCommand('Invalid File'));
            } else {
                return false;
            }
        }
    }


    /**
     * @param $fileId
     * @return mixed
     */
    public function fileSharedWith($fileId)
    {
        $file = $this->find($fileId);

        if ($file->isOwnerId($this->auth->id())) {
            try {
                return $file->sharedWith();
            } catch (Exception $e) {
                return $this->dispatch(new HandleErrorCommand($e->getMessage()));
            }
        }
    }


    public function test($fileId)
    {


        //$key2 = Crypt::decrypt($key1);

        //return  [$rand, $key1, $key2];
    }


    /**
     * @param int $fileId
     * @return array
     */
    public function getFileInfo($fileId)
    {
        $file = $this->file->find($fileId);

        $properties = [
            'Size' => $this->disk->size($file->path),
            'Owner' => $file->owner()
            //etc
        ];

        return $properties;
    }


    /**
     * @param int $userId
     * @return array
     */
    public function sharedWithUser($userId)
    {
        $user = $this->user->find($userId);
        return $user->sharedFiles();
    }

    /**
     * @param int $groupId
     * @return array
     */
    public function sharedWithGroup($groupId)
    {
        $group = $this->group->find($groupId);
        return $group->sharedFiles();
    }















































//Private Functions




    /**
     * @param $path
     * @return mixed
     */
    private function removeSlash($path)
    {
        $path = preg_replace('/\/+$/', '', $path);
        $path = preg_replace('/^\/+/', '', $path);
        return $path;
    }


    /**
     * @param null $fileId
     * @param null $path
     * @param bool $checkRoot
     * @param null $userId
     * @return string
     *
     * //Check Root just ensures rootFolder is not appended. If appended, it removes.
     * //User Id is just for check root. Does not add auth id to the path.
     */


    private function pathProcessor($fileId = null, $path = null, $checkRoot = true, $userId = null)
    {
        $userId = $userId ? $userId : $this->auth->id();    //Just to verify rootFolder is not appended. Does not add auth id to the path.

        $path = $path ? $this->removeSlash(str_replace('\\', '/', $path)) : null;


        if ($fileId !== null) {
            $dirPath = $this->file->find($fileId)->path . $this->file->find($fileId)->name;
        } elseif ($path) {
            $dirPath = '/' . $path . '/';
        } else {
            $dirPath = '/';
        }

        if ($checkRoot) {
            $realFile = $this->file->where('path', '=', $dirPath)->where('owner_id', '=', $userId)->first();

            $pattern = '/^\/' . $this->auth->id() . '/';

            if (preg_match($pattern, $dirPath) && !$realFile) {
                $dirPath = substr_replace($dirPath, '/', 0, 3);
            }
        }

        return $dirPath;
    }




    /**
     * @param $fileId
     * @return bool
     */
    private function isSharedFile($fileId){
        $userId = $this->auth->id();
        $filesSharedWithUser = $this->user->find($userId)->allFilesSharedWith->toArray();
        $isSharedFile = false;
        foreach ($filesSharedWithUser as $fileSharedWithUser){
            if($fileSharedWithUser['id'] === $fileId){
                $isSharedFile = true;
                break;
            }
        }
        return $isSharedFile;
    }


    /**
     * @param $fileList
     * @return array
     */
    private function appendShareStatus($fileList) {
        $response = [];

        foreach ($fileList as $item) {
            $file = $this->file->find($item['id']);
            $sharedUsers = $file->sharedWith()->get()->toArray();
            if ($sharedUsers) {
                $sharedWith = [];
                foreach ($sharedUsers as $sharedUser) {
                    array_push($sharedWith, $sharedUser['id']);
                }
                $item['shared_with'] = $sharedWith;
            }
            array_push($response, $item);
        }

        return $response;
    }


    /**
     * @param string $userId
     * @param string|path $parentPath
     * @param bool $toSharedUser
     * @return array
     */
    private function listFiles($userId, $parentPath, $toSharedUser = false)
    {
        $diskPath = $userId . $parentPath;

        //dump($diskPath);

        //Array containing file ids' and directory ids' in requested directory
        $contents = [];


        //Push directories to $files array
        foreach ($this->disk->directories($diskPath) as $directory) {
            array_push($contents, $directory);
        }

        //Push files to $files array
        foreach ($this->disk->files($diskPath) as $file) {
            array_push($contents, $file);
        }

        //Create array with file details fetched to return
        $result = [];

        foreach ($contents as $item) {
            $record = $this->file->where('name', '=', basename($item))->where('path', '=', $parentPath)->where('trashed', '!=', '1')->get()->toArray();
            if ($record) {
                array_push($result, array_pop($record));
            }

        }

        if($toSharedUser){
            return $result;
        } else {
            return $this->appendShareStatus($result);
        }

    }






    /**
     * @param string $currentPath
     * @param string $currentName
     * @param string $newPath
     * @param string|optional $newName
     * @throws \Exception
     * @return bool|mixed
     */
    private function fileMover($currentPath, $currentName = null, $newPath, $newName = null)
    {

        if (!$currentName) {
            $currentPath = preg_replace('/\/+$/', '', $currentPath);
            $currentName = basename($currentPath);
            $currentPath = str_replace($currentName, '', $currentPath);
        }

        $currentPath = $this->pathProcessor(null, $currentPath);
        $newPath = $this->pathProcessor(null, $newPath);

        $dbCurrentPath = $currentPath;
        $dbNewPath = $newPath;


        $currentPath = $this->auth->id() . $currentPath;
        $newPath = $this->auth->id() . $newPath;
        $newName = $newName ? $newName : $currentName;


        try {
            $this->disk->move($currentPath . $currentName, $newPath . $newName);
        } catch (\Exception $e) {
            throw $e;
        }


        $file = $this->file->where('owner_id', '=', $this->auth->id())->where('path', '=', $dbCurrentPath)->where('name', '=', $currentName)->first();
        $file->path = $dbNewPath;
        $file->name = $newName;
        $file->save();

        return true;
    }


    /**
     * @param $currentPath
     * @param null $currentName
     * @param $newPath
     * @param null $newName
     * @return mixed
     */
    private function directoryMover($currentPath, $currentName = null, $newPath, $newName = null)
    {


        if (!$currentName) {
            $currentPath = preg_replace('/\/+$/', '', $currentPath);
            $currentName = basename($currentPath);
            $currentPath = substr_replace($currentPath, '', -strlen($currentName) - 1);
        }

        $currentPath = $this->pathProcessor(null, $currentPath);
        $newPath = $this->pathProcessor(null, $newPath);
        $newName = $newName ? $newName : $currentName;


        //dd($currentName . ',' . $newPath);
        // dump($newPath . ',' . $newName);


        try {

            if ($this->createDirectory($newName, $newPath, null, false)) {
                $currentPath = $currentPath . $currentName;
                $newPath = $newPath . $newName;

                $files = $this->disk->files($this->auth->id() . $currentPath);
                $subDirectories = $this->disk->directories($this->auth->id() . $currentPath);

                foreach ($files as $fileToMove) {
                    $this->fileMover($fileToMove, null, $newPath);
                }

                foreach ($subDirectories as $directory) {
                    $this->directoryMover($directory, null, $newPath);
                }

            }

        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return true;
    }


    /**
     * @param string $currentPath
     * @param string $currentName
     * @param string $newPath
     * @param string|optional $newName
     * @param bool $sharedFile
     * @throws \Exception
     * @return bool|mixed
     */
    private function fileCopier($currentPath, $currentName = null, $newPath, $newName = null, $sharedFile = false)
    {

        if (!$currentName) {
            $currentPath = preg_replace('/\/+$/', '', $currentPath);
            $currentName = basename($currentPath);
            $currentPath = str_replace($currentName, '', $currentPath);
        }

        $currentPath = $this->pathProcessor(null, $currentPath);
        $newPath = $this->pathProcessor(null, $newPath);

        $dbCurrentPath = $currentPath;
        $dbNewPath = $newPath;


        if(!$sharedFile) {
            $currentPath = $this->auth->id() . $currentPath;
        }
        $newPath = $this->auth->id() . $newPath;
        $newName = $newName ? $newName : $currentName;


        try {
            $this->disk->copy($currentPath . $currentName, $newPath . $newName);
        } catch (\Exception $e) {
            throw $e;
        }


        $file = $this->file->where('owner_id', '=', $this->auth->id())->where('path', '=', $dbCurrentPath)->where('name', '=', $currentName)->first();

        $this->file->create([
            'owner_id' => $this->auth->id(),
            'name' => $file->name,
            'path' => $dbNewPath,
            'type' => 'file',
            'mime' => $file->mime,
            'size' => $file->size
        ]);

        return true;
    }


    /**
     * @param $currentPath
     * @param null $currentName
     * @param $newPath
     * @param null $newName
     * @return mixed
     */
    private function directoryCopier($currentPath, $currentName = null, $newPath, $newName = null)
    {


        if (!$currentName) {
            $currentPath = preg_replace('/\/+$/', '', $currentPath);
            $currentName = basename($currentPath);
            $currentPath = substr_replace($currentPath, '', -strlen($currentName) - 1);
        }

        $currentPath = $this->pathProcessor(null, $currentPath);
        $newPath = $this->pathProcessor(null, $newPath);
        $newName = $newName ? $newName : $currentName;


        //dd($currentName . ',' . $newPath);
        // dump($newPath . ',' . $newName);

        try {

            if ($this->createDirectory($newName, $newPath, null, false)) {
                $currentPath = $currentPath . $currentName;
                $newPath = $newPath . $currentName;

                $files = $this->disk->files($this->auth->id() . $currentPath);
                $subDirectories = $this->disk->directories($this->auth->id() . $currentPath);

                foreach ($files as $fileToMove) {
                    $this->fileCopier($fileToMove, null, $newPath);
                }

                foreach ($subDirectories as $directory) {
                    $this->directoryCopier($directory, null, $newPath);
                }

            }

        } catch (\Exception $e) {
            return $this->dispatch(new HandleErrorCommand($e->getMessage()));
        }

        return true;
    }

}
