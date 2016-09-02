<?php
namespace src\model;
use Silex\Application;
class UserModel
{
    private $db;
    function __construct(Application $app)
    {
        //$this->db = $app['db'];
    }
    public function validateUser($email, $password)
    {
        if($email == 'abc' && $password == '12345')
        {
            return array(
                'success' => 1,
                'email' => 'abc',
                'role' => 'READ_WRITE',
                'account' => 1
            );
        }

        return array(
            'success' => 0
        );
    }
}