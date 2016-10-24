<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

/**
 * Class AnalyticsModel
 * @package src\model
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class AnalyticsModel
{
    /**
     * @var
     */
    private $db;

    /**
     * AnalyticsModel constructor.
     * @param Application $app
     */
    function __construct(Application $app)
    {
        //initialize
        $app['db'];
    }

    /**
     * @param $campaign_id
     * @return array
     */
    function getAuthData($campaign_id)
    {
        return R::getRow('SELECT * FROM analytics WHERE campaign_id= ?', array($campaign_id));
    }

    /**
     * @param $campaign_id
     * @return int
     */
    function removeAnalytics($campaign_id)
    {
        return R::exec('DELETE FROM analytics WHERE campaign_id=?',array($campaign_id));
    }

    /**
     * @param $data
     * @return int|string
     */
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