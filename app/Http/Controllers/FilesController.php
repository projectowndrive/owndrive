<?php namespace OwnDrive\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesCommands;
use OwnDrive\Http\Requests;
use OwnDrive\Http\Controllers\Controller;

use Illuminate\Http\Request;



use OwnDrive\Http\Requests\CopyFileRequest;
use OwnDrive\Http\Requests\CreateDirectoryRequest;
use OwnDrive\Http\Requests\FileOperationRequest;
use OwnDrive\Http\Requests\GetFilesRequest;
use OwnDrive\Http\Requests\GetFilteredFilesRequest;
use OwnDrive\Http\Requests\MoveFileRequest;
use OwnDrive\Http\Requests\RenameFileRequest;
use OwnDrive\Http\Requests\ShareFileRequest;
use OwnDrive\Http\Requests\UploadFileRequest;
use OwnDrive\Services\FileService;


class FilesController extends Controller {

use DispatchesCommands;

    function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function searchFiles(Request $request)
    {
        $query = $request->input('query');

        return $this->fileService->search($query);
    }


    public function getFiles(GetFilesRequest $request)
    {
        $userId = $request->input('userId');
        $parentId = $request->input('parentId');
        $path = $request->input('path');

        if($request->has('parentId')){
            return $this->fileService->listFilesById($parentId, $userId);
        } elseif ($request->has('path')){
            return $this->fileService->listFilesByPath($path, $userId);
        }
        else{
            return $this->fileService->listFilesById();
        }
    }



    public function getRecentFiles(GetFilteredFilesRequest $request)
    {
        return $this->fileService->getRecentFiles($request->input('userId'));
    }

    public function getFavoriteFiles(GetFilteredFilesRequest $request)
    {
        return $this->fileService->getFavoriteFiles($request->input('userId'));
    }

    public function getTrashedFiles(GetFilteredFilesRequest $request)
    {
        return $this->fileService->getTrashedFiles($request->input('userId'));
    }

    public function getFilesSharedWith(GetFilteredFilesRequest $request)
    {
        $ownerId = $request->input('ownerId');
        $parentId = $request->input('parentId');
        $path = $request->input('path');

        return $this->fileService->getFilesSharedWith($ownerId, $parentId, $path);
    }





    public function uploadFile(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'file' => 'required',
            'parentId' => 'required_without:path|exists:files,id,type,folder',
            'path' => 'required_without:parentId|path:files,path,name,type,folder',
        ]);

        if($validator->fails()) {
            return \Response::make($validator->messages());
        }


        $file = $request->file('file');
        $path = $request->input('path');
        $parentId = $request->input('parentId');

        return $this->fileService->putFile($file, $path, $parentId);
    }


    public function createDirectory (CreateDirectoryRequest $request)
    {
        $directoryName = $request->input('directoryName');
        $path = $request->input('path');
        $parentId = $request->input('parentId');

        return $this->fileService->createDirectory($directoryName, $path, $parentId);
    }








    public function renameFile (RenameFileRequest $request)
    {
        $fileId = $request->input('fileId');
        $newName = $request->input('newName');

        return $this->fileService->renameFile($fileId, $newName);
    }



    public function copyFile( CopyFileRequest $request )
    {
        $fileId = $request->input('fileId');
        $newPath = $request->input('newPath');

        return $this->fileService->copyFile($fileId, $newPath);
    }

    public function moveFile( MoveFileRequest $request)
    {
        return $this->fileService->moveFile($request->input('fileId'), $request->input('newPath'));
    }




    public function trashFile(FileOperationRequest $request)
    {
        return $this->fileService->trashFile($request->input('fileId'));
    }



    public function deleteFile(FileOperationRequest $request)
    {
        return $this->fileService->deleteFile($request->input('fileId'));
    }


    public function restoreFile(FileOperationRequest $request)
    {
        return $this->fileService->restoreFile($request->input('fileId'));
    }




    public function addFavorites(FileOperationRequest $request)
    {
        return $this->fileService->addFavorites($request->input('fileId'));
    }


    public function removeFavorites(FileOperationRequest $request)
    {
        return $this->fileService->removeFavorites($request->input('fileId'));
    }

    public function getDownloadUrl(FileOperationRequest $request)
    {
        return $this->fileService->getDownloadUrl($request->input('fileId'));
    }

    public function downloadFile($downloadKey)
    {
        return $this->fileService->downloadFile($downloadKey);
    }


    public function fileShareManager( ShareFileRequest $request )
    {
        $fileId = $request->input('fileId');
        $shareUserIds = $request->input('shareUserIds');
        $unshareUserIds = $request->input('unshareUserIds');

        return $this->fileService->fileShareManager($fileId, $shareUserIds, $unshareUserIds);
    }


    public function shareFile( ShareFileRequest $request )
    {
        $fileId = $request->input('fileId');
        $userIds = $request->input('userIds');

        return $this->fileService->shareFile($fileId, $userIds);
    }

    public function removeShareFile( ShareFileRequest $request )
    {
        $fileId = $request->input('fileId');
        $userIds = $request->input('userIds');

        return $this->fileService->removeShareFile($fileId, $userIds);
    }




    public function test($fileId)
    {
        return $this->fileService->test($fileId);
    }







    public function getFilesOfGroup(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'groupId' => 'required|int|exists:groups,id'
        ]);
        if($validator->fails()) {
            return \Response::make([
                'status' => 'error',
                'message' => $validator->messages()
            ], 400);
        }


        return $this->fileService->sharedWithGroup($request->input('groupId'));
    }




}
