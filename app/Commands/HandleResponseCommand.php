<?php namespace OwnDrive\Commands;

use OwnDrive\Commands\Command;

class HandleResponseCommand extends Command {
    /**
     * @var
     */
    public $message;

    /**
     * Create a new command instance.
     *
     * @param $message
     * @return \OwnDrive\Commands\HandleResponseCommand
     */
	public function __construct($message)
	{
        $this->message = $message;
    }

}
