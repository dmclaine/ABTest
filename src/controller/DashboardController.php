<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;


class DashboardController implements ControllerProviderInterface
{
    private $campaignService;
    private $analyticsService;
    private $goalService;

    public function __construct(Application $app)
    {
        $this->campaignService = $app['CampaignService'];
        $this->analyticsService = $app['AnalyticsService'];
        $this->goalService = $app['GoalService'];
    }
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];
        $controllers->before(function() use ($app) {
            if(null === $app['session']->get('user')) {
                return $app->redirect('/');
            }
        });
        $controllers->get('/new', $this->newCampaign());
        $controllers->get('/campaigns', $this->campaigns());
        $controllers->get('/campaigns/archived', $this->archivedCampaigns());
        $controllers->get('/campaign/edit/{id}', $this->editCampaign());
       // $controllers->get('/campaign/analytics/{id}', $this->analytics());
        $controllers->get('/', $this->display());//->secure('ROLE_USER')
        ;
        return $controllers;
    }

    public function newCampaign()
    {
        return function (Application $app, Request $request) {
            try {
                return $app['twig']->render('newCampaign.html',array(
                    'page_title'=>'New Campaign'
                ));
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };

    }



    public function editCampaign()
    {
        return function (Application $app, Request $request) {
            try {
                $id = $request->get('id');
                $data = $this->campaignService->getCampaignDataByID($id);
                $goals = $this->goalService->getAllGoals($id);
                $app['session']->set('campaign_id', $id);
                return $app['twig']->render('editCampaign.html',array(
                    'page_title'=>'Editing Campaign',
                    'id' => $id,
                    'data' => $data,
                    'goals' => $goals,
                ));
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };

    }

    public function campaigns()
    {
        return function (Application $app, Request $request) {
            try {
                $campaigns = $this->campaignService->getAllCampaigns();

                return $app['twig']->render('campaigns.html',array(
                    'page_title'=>'Campaigns',
                    'data' => $campaigns
                ));
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };

    }

    public function archivedCampaigns()
    {
        return function (Application $app, Request $request) {
            try {
                $campaigns = $this->campaignService->getAllCampaigns('archived');

                return $app['twig']->render('campaigns.html',array(
                    'page_title'=>'Archived Campaigns',
                    'data' => $campaigns
                ));
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };

    }
    public function display()
    {
        return function (Application $app) {
            try {
               // $this->someService->someMethod();
                return $app->json(['ret' => true, 'data' => 'success']);
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };
    }
}