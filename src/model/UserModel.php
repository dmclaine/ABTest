<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

/**
 * Class UserModel
 * @package src\model
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class UserModel
{
    /**
     * @var mixed
     */
    private $db;

    /**
     * UserModel constructor.
     * @param Application $app
     */
    function __construct(Application $app)
    {
        $this->db = $app['db'];
    }

    /**
     * @param $email
     * @param $password
     * @return array
     */
    public function validateUser($email, $password)
    {
        $user = R::getRow('SELECT * FROM users u
                            WHERE u.email=? AND u.password=?', array($email, md5($password)));

        if(!$user) {
            return array(
                'success' => 0
            );
        }
        $accounts = R::getAll('SELECT account_id, role FROM user_relation
                                WHERE user_id=?', array($user['id']));

        if($user) {
            return array(
                'success' => 1,
                'email' => $user['email'],
                'account' => $accounts,
                'name'  => $user['name'],
                'user_id' => $user['id']
            );
        }
    }

    /**
     * @param $data
     * @return int|string
     */
    public function insertLog($data)
    {
        $log = R::dispense('log');

        foreach($data as $col => $value)
        {
            $log->$col = $value;
        }

        $log->created = date('Y-m-d H:i:s');

        return R::store($log);
    }

    /**
     * @param $criteria
     * @return array
     */
    public function getLogs($criteria)
    {
        $defaults = array(
            'campaign_id' => '',
            'code' => 'STATUS_CHANGE',
            'order_type' => 'ASC',
            'order_by'  => 'created'
        );
        $criteria = array_merge($defaults, $criteria);

        return R::getAll('SELECT * FROM log WHERE campaign_id = ? AND code = ? ORDER BY '. $criteria['order_by'] . $criteria['orderType'],
                array($criteria['campaign_id'], $criteria['code']));
    }
}