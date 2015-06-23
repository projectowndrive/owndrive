<?php namespace OwnDrive\Commands;

use OwnDrive\Commands\Command;

class HandleErrorCommand extends Command {
    /**
     * @var
     */
    public $errorMessage;

    /**
     * Create a new command instance.
     *
     * @param string $errorMessage
     * @return \OwnDrive\Commands\HandleErrorCommand
     */
	public function __construct($errorMessage)
	{
        $this->errorMessage = $errorMessage;
    }

}
