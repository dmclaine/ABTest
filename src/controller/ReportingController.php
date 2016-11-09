<?php

namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use src\service\AnalyticsService;
use src\service\CampaignService;
use src\service\GoalService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ReportingController implements ControllerProviderInterface
{
    /**
     * @var AnalyticsService
     */
    private $analyticsService;
    /**
     * @var CampaignService
     */
    private $campaignService;
    /**
     * @var GoalService
     */
    private $goalService;
    /**
     * @var Application
     */
    private $app;
    /**
     * @var
     */
    private $visitors;

    /**
     * @var bool
     */
    private $doCache = false;
    /**
     * In secs. for 1 hour
     * @var int
     */
    private $cacheTime = 3600;
    /**
     * ReportingController constructor.
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->analyticsService = $app['AnalyticsService'];
        $this->campaignService = $app['CampaignService'];
        $this->goalService = $app['GoalService'];

        $referrer = $_SERVER['HTTP_REFERER'];
        //are we giving back the cache data ?
        //we need a better way to do this
        if(strpos($referrer,'nocache=true') > 0)
        {
            $this->doCache = false;
        }
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
        $controllers->get('/traffic-report', $this->displayTrafficReport());
        $controllers->get('/goals-report', $this->displayGoalReports());
        $controllers->post('/set-start-date', $this->setStartDate());

        return $controllers;
    }

    /**
     * @return \Closure
     */
    function displayGoalReports()
    {
        return function (Application $app, Request $request) {
            $campaign_id = $app['session']->get('campaign_id');
            $vnames = $this->getVariationNames($campaign_id);
            $goals = $this->goalService->getAllGoals($campaign_id);
            $output = array();
            foreach($goals as $goal){
                $output[$goal['id']] = $this->getGoalReport($goal);
                $output[$goal['id']]['significance'] = $this->goalService->calculateSignificance($output[$goal['id']],$campaign_id);
            }

            $body = $app['twig']->render('partials/reporting-goals.html',array(
                'goals' => $goals,
                'goalreport' => $output,
                'vnames' => $vnames
            ));
            return new Response($body, 200, array('Cache-Control' => 's-maxage=3600, public'));
        };
    }

    /**
     * @param $goal
     * @return array
     */
    private function getGoalReport($goal)
    {
        $campaign_id = $this->app['session']->get('campaign_id');

        if ($this->app['cache']->contains('report-'.$campaign_id) && $this->doCache)
        {
            $data = $this->app['cache']->fetch('report-'.$campaign_id);
        }
        else {
            $filters = $this->getFilters($goal,false);
            $total_visitors = $this->totalVisitorsInGoal($filters, $goal);

            if ($goal['action'] == 'event') {

                $sequence = "";
                if ($goal['e_category'] != "") {
                    $sequence .= 'ga:eventCategory==' . $goal['e_category'] . ';';
                }
                if ($goal['e_action'] != "") {
                    $sequence .= 'ga:eventAction==' . $goal['e_action'] . ';';
                }
                if ($goal['e_label'] != "") {
                    $sequence .= 'ga:eventLabel==' . $goal['e_label'];
                }
                $sequence = rtrim($sequence, ';');
                $params = array(
                    'metrics' => array('ga:sessions'),
                    'dimensions' => array('ga:eventLabel', 'ga:date', 'ga:segment'),
                    'filters' => $filters,
                    'campaign_id' => $goal['campaign_id'],
                    'sort' => array(
                        'name' => 'ga:date',
                        'order' => 'ASCENDING'
                    ),
                    'property' => 'category'
                );
                if ($sequence != "") {
                    $params['sequence'] = 'sessions::sequence::ga:landingPagePath'. $goal['action_arrive_pp_pattern'] . $goal['page_path'].';->>' . $sequence;
                }

            } else if ($goal['action'] == 'action-pp') {

                $sequence = 'sessions::sequence::ga:landingPagePath'. $goal['action_arrive_pp_pattern'] . $goal['page_path'] . ';->ga:pagePath' . $goal['action_pp_pattern'] . $goal['action_pp'];
                $params = array(
                    'metrics' => array('ga:sessions'),
                    'dimensions' => array('ga:eventLabel', 'ga:date', 'ga:segment'),
                    'filters' => $filters,
                    'campaign_id' => $goal['campaign_id'],
                    'sort' => array(
                        'name' => 'ga:date',
                        'order' => 'ASCENDING'
                    ),
                    'sequence' => $sequence
                );

            }

            $data = array(
                'report' => $this->analyticsService->analyticsRequest($params),
                'participants' => $total_visitors
            );
            $this->app['cache']->save('report-'.$campaign_id, $data,$this->cacheTime);
        }

        return $data;
    }

    /**
     * @param $filters
     * @param $goal
     * @return mixed
     */
    private function totalVisitorsInGoal($filters, $goal)
    {
        if(isset($this->visitors[$goal['page_path']])) {
            return $this->visitors[$goal['page_path']];
        }

        $sequence = 'sessions::sequence::ga:landingPagePath'.$goal['action_arrive_pp_pattern'].$goal['page_path'];
        $params = array(
            'metrics'=> array('ga:sessions'),
            'dimensions'=> array('ga:eventLabel','ga:segment'),
            'filters' => $filters,
            'sequence' => $sequence,
            'campaign_id' => $goal['campaign_id']
        );
        $data = $this->analyticsService->analyticsRequest($params);
        $this->visitors[$goal['page_path']] = $data;
        return $data;
    }

    /**
     * @param $goal
     * @param bool $addPagePath
     * @return string
     */
    private function getFilters($goal, $addPagePath = true)
    {
        $vids = $this->getVariationIds($goal['campaign_id']);
        $prefix = 'ga:eventLabel==ABTest-'.$goal['campaign_id'].':';
        $filters = $prefix.implode(','.$prefix,$vids);
//        $filters = 'ga:eventLabel==ABTest-63:Control,ga:eventLabel==ABTest-63:Variation 1';
        if($addPagePath && $goal['page_path'] != '') {
            $filters .= ';ga:landingPagePath=='.$goal['page_path'];
        }
        return $filters;

    }

    /**
     * @param $cid
     * @return array
     */
    function getVariationNames($cid)
    {
        $data = array();
        $campaign = $this->campaignService->getCampaignDataByID($cid);

        foreach($campaign['variations'] as $vid => $variation) {
            $data[$variation['id']] = $variation['name'];
        }
        return $data;
    }

    /**
     * @param $cid
     * @return array|null
     */
    function getVariationIds($cid)
    {
        static $vids = null;

        if($vids !== null) {
            return $vids;
        }
        $data = array();
        $campaign = $this->campaignService->getCampaignDataByID($cid);

        foreach($campaign['variations'] as $vid => $variation) {
            $data[] = $variation['id'];
        }
        $vids = $data;
        return $vids;
    }

    /**
     * @return \Closure
     */
    function displayTrafficReport()
    {
        return function (Application $app, Request $request) {
            $campaign_id = $app['session']->get('campaign_id');
            $days_running = 0;
            $start_date = $this->campaignService->getStartDate($campaign_id);
            $is_running = $this->campaignService->isCampaignRunning($campaign_id);
            $vnames = $this->getVariationNames($campaign_id);

            if($is_running && $start_date != "") {
                $now = time(); // or your date as well
                $start_date =  strtotime($start_date);
                $datediff = $now - $start_date;

                $days_running = ($start_date == "") ? 0 : floor($datediff / (60 * 60 * 24));
            }
            if ($app['cache']->contains('traffic-'.$campaign_id) && $this->doCache)
            {
                $body = $app['cache']->fetch('traffic-'.$campaign_id);
            }
            else
            {
                $vids = $this->getVariationIds($campaign_id);
                $prefix = 'ga:eventLabel==ABTest-' . $campaign_id . ':';
                $filters = $prefix . implode(',' . $prefix, $vids);
                $data = $this->analyticsService->analyticsRequest(array(
                    'metrics' => array('ga:sessions'),
                    'dimensions' => array('ga:eventLabel', 'ga:date'),
                    'filters' => $filters,
                    'campaign_id' => $campaign_id,
                    'sort' => array(
                        'name' => 'ga:date',
                        'order' => 'ASCENDING'
                    ),
                    'property' => 'category'
                ));
                $body = $app['twig']->render('partials/reporting-traffic.html',array(
                    'traffic_data' => $data,
                    'days_running' => $days_running,
                    'vnames'        => $vnames
                ));
                $app['cache']->save('traffic-'.$campaign_id, $body,$this->cacheTime);
            }
            return new Response($body, 200, array('Cache-Control' => 's-maxage=3600, public'));
        };
    }

    /**
     * @return \Closure
     */
    public function setStartDate()
    {
        return function (Application $app, Request $request) {
            $campaign_id = $app['session']->get('campaign_id');
            $app['session']->set('campaign_start_date',$request->get('campaign_start_date'));
            $app['session']->set('campaign_end_date',$request->get('campaign_end_date'));
            $app['cache']->delete('traffic-'.$campaign_id);
            $app['cache']->delete('report-'.$campaign_id);
            return $app->json(['ret' => true]);
        };
    }
}