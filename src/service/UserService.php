<?php
namespace src\service;
use Silex\Application;

/**
 * Class UserService
 * @package src\service
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class UserService
{
    /**
     * @var mixed
     */
    private $userModel;
    /**
     * @var Application
     */
    private $app;

    /**
     * UserService constructor.
     * @param Application $app
     */
    function __construct(Application $app)
    {
        $this->app = $app;
        $this->userModel = $app['UserModel'];
    }

    /**
     * @param $email
     * @param $password
     * @return mixed
     */
    public function validateUser($email, $password)
    {
        return $this->userModel->validateUser($email, $password);
    }

    /**
     * @param $data
     * @return mixed
     */
    public function insertLog($data)
    {
        $user_id = $this->app['session']->get('user_id');
        $data['user_id'] = $user_id;
        return $this->userModel->insertLog($data);
    }

    /**
     * @param $campaign_id
     * @param $code
     * @return mixed
     */
    public function getLogs($campaign_id, $code)
    {
        return $this->userModel->getLogs($campaign_id,$code);
    }
}