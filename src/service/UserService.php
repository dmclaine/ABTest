<?php
namespace src\service;
use Silex\Application;
class UserService
{
    private $userModel;

    function __construct(Application $app)
    {
        $this->userModel = $app['UserModel'];
    }
    public function validateUser($email, $password)
    {
        return $this->userModel->validateUser($email, $password);
    }
}