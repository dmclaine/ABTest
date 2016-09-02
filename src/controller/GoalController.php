<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;


class GoalController implements ControllerProviderInterface
{
    private $analyticsService;
    private $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->analyticsService = $app['AnalyticsService'];
    }
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->before(function() use ($app) {
            if(null === $app['session']->get('user')) {
                return $app->redirect('/');
            }
        });
        $controllers->get('/event-categories/{campaign_id}', $this->getEventCategories());
        $controllers->get('/event-names/{campaign_id}', $this->getEventNames());
        $controllers->get('/event-actions/{campaign_id}', $this->getEventActions());

        return $controllers;
    }

    function getEventCategories()
    {
        return function (Application $app, Request $request) {
            
            $this->analyticsService->getEventProperty(array('dimensions'=>'ga:eventCategory', 'campaign_id' => 1, 'property' => 'category'));
            return $app->json(['ret' => true, 'data'=> '']);
        };
    }
    function getEventNames() {

    }
    function getEventActions() {

    }
}