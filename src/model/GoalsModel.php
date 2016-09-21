<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

class GoalsModel
{
    private $db;
    function __construct(Application $app)
    {
        //initialize
        $app['db'];
    }

    public function saveGoalData($data,$campaign_id)
    {

        $goalId = R::getCell('SELECT id FROM goals WHERE id=? AND campaign_id=?',array($data['id'],$campaign_id));

        $goal = (!$goalId) ? R::dispense('goals') : R::load('goals',$goalId);

        $goal->campaign_id = $campaign_id;

        foreach($data as $col => $value)
        {
            $goal->$col = $value;
        }
        return R::store($goal);

    }

    public function getGoalById($id)
    {
        return R::getRow('SELECT * FROM goals WHERE id=?',array($id));
    }

    public function deleteGoal($id)
    {
        return R::exec('DELETE FROM goals WHERE id=?',array($id));
    }

    public function getAllGoals($campaign_id)
    {
        return R::getAll('SELECT * FROM goals WHERE campaign_id=?',array($campaign_id));
    }

}