<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

class UserModel
{
    private $db;
    function __construct(Application $app)
    {
        $this->db = $app['db'];
    }
    public function validateUser($email, $password)
    {
        if($email == 'abc' && $password == '12345')
        {
            return array(
                'success' => 1,
                'email' => 'abc',
                'role' => 'READ_WRITE',
                'account' => 1,
                'name'  => 'Abhi',
                'user_id' => 1
            );
        }

        return array(
            'success' => 0
        );
    }

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