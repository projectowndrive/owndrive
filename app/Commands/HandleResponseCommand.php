<?php namespace OwnDrive\Commands;

use OwnDrive\Commands\Command;

class HandleResponseCommand extends Command {
    /**
     * @var
     */
    public $message;

    /**
     * @var
     */
    public $data;


    /**
     * Create a new command instance.
     *
     * @param $message
     * @param null $data
     * @return \OwnDrive\Commands\HandleResponseCommand
     */
	public function __construct($message, $data = null)
	{
        $this->message = $message;
        $this->data = $data;
    }

}
