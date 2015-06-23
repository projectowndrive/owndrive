<?php
/**
 * Created by PhpStorm.
 * User: Wave Studios
 * Date: 05/06/15
 * Time: 8:08 PM
 */

namespace OwnDrive\Services;

use Illuminate\Validation\Validator;

class CustomValidators extends Validator{

    public function validatepath($attribute, $value, $parameters){

        if($value === '/'){
            return true;
        }


        if ($parameters){
            $table = $parameters[0] ? $parameters[0] : 'files';
            $column = $parameters[1] ? $parameters[1] : 'path';
            $name = $parameters[2] ? $parameters[2] : 'name';
        }else{
            $table = 'files';
            $column = 'path';
            $name = 'name';
        }

        array_shift($parameters);
        array_shift($parameters);
        array_shift($parameters);



        $itemName = basename($value);
        array_push($parameters, $name);
        array_push($parameters, $itemName);

        $value = preg_replace('/^\/+/', '', $value);
        $regex = '/' . basename($value) . '\/?$/';
        $value = preg_replace($regex, '', $value);
        $value = '/' . $value;



         // dd($table, $column, $value, [$name, $itemName]);

        if($this->getExistCount($table, $column, $value, $parameters) >= 1) {
            return true;
        }

        return false;
    }

    protected function replacepath($message, $attribute, $rule, $parameters)
    {
        $return = 'The selected ' . $attribute . ' is invalid';

        return $message = $return;
    }


}