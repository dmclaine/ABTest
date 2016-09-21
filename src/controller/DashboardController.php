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
        $controllers->get('/campaign/new', $this->newCampaign());
        $controllers->get('/campaigns', $this->campaigns());
        $controllers->get('/campaigns/archived', $this->archivedCampaigns());
        $controllers->get('/campaign/edit/{id}', $this->editCampaign());
       // $controllers->get('/campaign/analytics/{id}', $this->analytics());
        $controllers->get('/', $this->display());

        $runningCampaigns = $this->campaignService->getRunningCampaigns();
        $app['twig']->addGlobal('runningCampaigns',$runningCampaigns);
        return $controllers;
    }

    public function newCampaign()
    {
        return function (Application $app, Request $request) {
            try {
                return $app['twig']->render('editCampaign.html',array(
                    'page_title'=>'New Campaign',
                    'mode' => 'new',
                    'data' => $this->defaultData()
                ));
            } catch (\Exception $e) {
                return $app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
            }
        };

    }

    private function defaultData()
    {
        return array(
            'campaign_name' => 'New Campaign - '. rand(999,9999),
            'variations' => array(
                'control' => array(
                    'js' => '//js control',
                    'css' => '//css',
                    'name' => 'Control',
                    'id' => 'control',
                    'traffic' => 50
                ),
        		'variation-1' => array(
                    'js' => '//js variation',
                    'css' => '//css',
                    'name' => 'Variation',
                    'id' => 'variation-1',
                    'traffic' => 50
                )
            )
    	);
    }


    public function editCampaign()
    {
        return function (Application $app, Request $request) {
            try {
                $id = $request->get('id');
                $data = $this->campaignService->getCampaignDataByID($id);
                $isConnected = $this->campaignService->isAnalyticsConnected($id);
                $goals = $this->goalService->getAllGoals($id);
                $app['session']->set('campaign_id', $id);
                if($app['session']->get('campaign_start_date') == null) {
                    $app['session']->set('campaign_end_date', date('Y-m-d'));
                    $app['session']->set('campaign_start_date', $data['start_date']);
                }
                return $app['twig']->render('editCampaign.html',array(
                    'page_title'=>'Editing Campaign',
                    'id' => $id,
                    'data' => $data,
                    'goals' => $goals,
                    'mode' => 'edit',
                    'connection' => (string) $isConnected,
                    'campaign_start_date' => $app['session']->get('campaign_start_date'),
                    'campaign_end_date' => $app['session']->get('campaign_end_date')
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