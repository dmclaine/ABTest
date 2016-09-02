<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

class AnalyticsModel
{
    private $db;
    function __construct(Application $app)
    {
        //initialize
        $app['db'];
    }

    function getAuthData($campaign_id)
    {
        return R::getRow('SELECT * FROM analytics WHERE campaign_id= ?', array($campaign_id));
    }

    function removeAnalytics($campaign_id)
    {
        return R::exec('DELETE FROM analytics WHERE campaign_id=?',array($campaign_id));
    }

    function manageAuthData($data)
    {
        $id = R::getCell('SELECT id FROM analytics WHERE campaign_id = ?', array($data['campaign_id']));

        $analytics = (!$id) ? R::dispense('analytics') : R::load('analytics', $id);

        foreach($data as $col => $value)
        {
            $analytics->$col = $value;
        }

        return R::store($analytics);
    }

}