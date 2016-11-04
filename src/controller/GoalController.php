<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use src\service\AnalyticsService;
use src\service\GoalService;
use Symfony\Component\HttpFoundation\Request;


/**
 * Class GoalController
 * @package src\controller
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class GoalController implements ControllerProviderInterface
{
    /**
     * @var AnalyticsService
     */
    private $analyticsService;
    /**
     * @var GoalService
     */
    private $goalService;
    /**
     * @var Application
     */
    private $app;

    /**
     * GoalController constructor.
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->analyticsService = $app['AnalyticsService'];
        $this->goalService = $app['GoalService'];
    }

    /**
     * @param Application $app
     * @return mixed
     */
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->before(function() use ($app) {
            if(null === $app['session']->get('user')) {
                return $app->redirect('/');
            }
        });
        $controllers->get('/display-goal-popup/{id}', $this->displayGoalPopup())->value('id',0);
        $controllers->get('/event-categories', $this->getEventCategories());
        $controllers->get('/event-actions/{category}', $this->getEventActions());
        $controllers->get('/event-labels/{category}/{action}', $this->getEventLabels());
        $controllers->post('/save-goal', $this->saveGoal());
        $controllers->post('/delete-goal/{goalId}', $this->deleteGoal());

        return $controllers;
    }


    /**
     * @return \Closure
     */
    function getEventCategories()
    {
        return function (Application $app, Request $request) {
            $campaign_id = $app['session']->get('campaign_id');
            $data = $this->analyticsService->analyticsRequest(array(
                'metrics'=> array('ga:sessions'),
                'campaign_id' => $campaign_id,
                'dimensions'=> array('ga:eventCategory'),
                'sort' => array(
                    'name' => 'ga:eventCategory',
                    'order' => 'ASCENDING'
                ),
                'property' => 'category'
            ));
            $output = array();
            foreach($data as $key => $value) {
                $output[$value['ga:eventCategory']] = $value['ga:eventCategory'];
            }
            return $app->json(['ret' => true, 'data'=> $output,'key' => 'ga:eventCategory']);
        };
    }

    /**
     * @return \Closure
     */
    function getEventActions()
    {

        return function (Application $app, Request $request) {

            $category = $request->get('category');
            $campaign_id = $app['session']->get('campaign_id');
            $data = $this->analyticsService->analyticsRequest(array(
                'metrics'=> array('ga:sessions'),
                'campaign_id' => $campaign_id,
                'filters' => 'ga:eventCategory=='.$category,
                'dimensions'=> array('ga:eventAction'),
                'sort' => array(
                    'name' => 'ga:eventAction',
                    'order' => 'ASCENDING'
                ),
                'property' => 'category'
            ));
            $output = array();
            foreach($data as $key => $value) {
                $output[$value['ga:eventAction']] = $value['ga:eventAction'];
            }
            return $app->json(['ret' => true, 'data'=> $output,'key' => 'ga:eventAction']);
        };

    }

    /**
     * @return \Closure
     */
    function getEventLabels() {

        return function (Application $app, Request $request) {

            $category = $request->get('category');
            $action = $request->get('action');
            $campaign_id = $app['session']->get('campaign_id');
            $data = $this->analyticsService->analyticsRequest(array(
                'metrics'=> array('ga:sessions'),
                'campaign_id' => $campaign_id,
                'filters' => 'ga:eventCategory=='.$category.',ga:eventAction=='.$action,
                'dimensions'=> array('ga:eventLabel'),
                'sort' => array(
                    'name' => 'ga:eventLabel',
                    'order' => 'ASCENDING'
                ),
                'property' => 'category'
            ));
            $output = array();
            foreach($data as $key => $value) {
                $output[$value['ga:eventLabel']] = $value['ga:eventLabel'];
            }
            return $app->json(['ret' => true, 'data'=> $output,'key' => 'ga:eventLabel']);
        };

    }

    /**
     * @return \Closure
     */
    function displayGoalPopup()
    {
        return function (Application $app, Request $request) {
            $goalId = $request->get('id');
            $data = $this->goalService->getGoalById($goalId);
            return $app['twig']->render('modals/goal-setup.html',array(
                'goal' => $data
            ));
        };
    }

    /**
     * @return \Closure
     */
    function saveGoal()
    {
        return function (Application $app, Request $request) {

            $goal = $request->get('goal');
            $campaign_id = $app['session']->get('campaign_id');

            $data = $this->goalService->saveGoal($goal,$campaign_id);

            return $app->json(['ret' => true, 'data'=> $data]);
        };

    }

    /**
     * @return \Closure
     */
    function deleteGoal()
    {
        return function (Application $app, Request $request) {

            $goal_id = $request->get('goalId');
            $data = $this->goalService->deleteGoal($goal_id);

            return $app->json(['ret' => true, 'data'=> $data]);
        };

    }
}