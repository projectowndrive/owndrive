<?php
/**
 * Created by PhpStorm.
 * User: Wave Studios
 * Date: 05/16/15
 * Time: 3:33 PM
 */

namespace OwnDrive\Services;


use Illuminate\Http\Response;

class ErrorHandlerService {
    /**
     * @var Response
     */
    private $response;

    /**
     * @param Response $response
     */
    function __construct(Response $response)
    {
        $this->response = $response;
    }

    /**
     * @param string $errorMessage
     */
    public function handleError($errorMessage){
        $this->response->create(
            [
                'status' => 'error',
                'message' => $errorMessage,
            ],400
        );
    }
} 