<?php
namespace src\service;
use Silex\Application;

class UserService
{
    private $userModel;
    private $app;

    function __construct(Application $app)
    {
        $this->app = $app;
        $this->userModel = $app['UserModel'];
    }
    public function validateUser($email, $password)
    {
        return $this->userModel->validateUser($email, $password);
    }

    public function insertLog($data)
    {
        $user_id = $this->app['session']->get('user_id');
        $data['user_id'] = $user_id;
        return $this->userModel->insertLog($data);
    }

    public function getLogs($campaign_id,$code)
    {
        return $this->userModel->getLogs($campaign_id,$code);
    }
}