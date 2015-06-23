<?php namespace OwnDrive\Handlers\Commands;

use Illuminate\Http\Response;
use OwnDrive\Commands\HandleErrorCommand;

use Illuminate\Queue\InteractsWithQueue;

class HandleErrorCommandHandler
{
    /**
     * @var Response
     */
    private $response;

    /**
     * Create the command handler.
     *
     * @param Response $response
     * @return \OwnDrive\Handlers\Commands\HandleErrorCommandHandler
     */
    public function __construct(Response $response)
    {
        $this->response = $response;
    }

    /**
     * Handle the command.
     *
     * @param  HandleErrorCommand $command
     * @return void
     */
    public function handle(HandleErrorCommand $command)
    {
        return $this->response->create(
            [
                'status' => 'error',
                'message' => $command->errorMessage
            ], 400
        );
    }

}
