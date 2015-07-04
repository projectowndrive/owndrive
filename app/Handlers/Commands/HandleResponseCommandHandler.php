<?php namespace OwnDrive\Handlers\Commands;

use Illuminate\Http\Response;
use OwnDrive\Commands\HandleResponseCommand;

use Illuminate\Queue\InteractsWithQueue;

class HandleResponseCommandHandler {
    /**
     * @var Response
     */
    private $response;

    /**
     * Create the command handler.
     *
     * @param Response $response
     * @return \OwnDrive\Handlers\Commands\HandleResponseCommandHandler
     */
	public function __construct(Response $response)
	{
        $this->response = $response;
    }

	/**
	 * Handle the command.
	 *
	 * @param  HandleResponseCommand  $command
	 * @return void
	 */
	public function handle(HandleResponseCommand $command)
	{
        return $this->response->create([
            'status' => 'success',
            'message' => $command->message,
            'data' => $command->data
        ],200);
	}

}