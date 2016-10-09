<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class ReportingController implements ControllerProviderInterface
{
    private $analyticsService;
    private $app;
    private $visitors;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->analyticsService = $app['AnalyticsService'];
        $this->campaignService = $app['CampaignService'];
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
        $controllers->get('/traffic-report', $this->displayTrafficReport());
        $controllers->get('/goals-report', $this->displayGoalReports());
        $controllers->post('/set-start-date', $this->setStartDate());

        return $controllers;
    }

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

    private function getGoalReport($goal)
    {
        $filters = $this->getFilters($goal);
        $total_visitors = $this->totalVisitorsInGoal($filters,$goal);

        if($goal['action'] == 'event') {

            $sequence = "";
            if($goal['e_category'] != "") {
                $sequence .= 'ga:eventCategory=='.$goal['e_category'].',';
            }
            if($goal['e_action'] != "") {
                $sequence .= 'ga:eventAction=='.$goal['e_action'] . ',';
            }
            if($goal['e_label'] != "") {
                $sequence .= 'ga:eventLabel=='.$goal['e_label'];
            }
            $sequence = rtrim($sequence,',');
            $params = array(
                'metrics'=> array('ga:sessions'),
                'dimensions'=> array('ga:eventLabel','ga:date','ga:segment'),
                'filters' => $filters,
                'campaign_id' => $goal['campaign_id'],
                'sort' => array(
                    'name' => 'ga:date',
                    'order' => 'ASCENDING'
                ),
                'property' => 'category'
            );
            if($sequence != "") {
                $params['sequence'] = 'sessions::sequence::'.$sequence;
            }

        }
        else if($goal['action'] == 'action-pp') {

            $sequence = 'sessions::sequence::ga:landingPagePath=='.$goal['page_path'].';->ga:pagePath'.$goal['action_pp_pattern'].$goal['action_pp'];
            $params = array(
                'metrics'=> array('ga:sessions'),
                'dimensions'=> array('ga:eventLabel','ga:date','ga:segment'),
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
        return $data;
    }

    private function totalVisitorsInGoal($filters, $goal)
    {
        if(isset($this->visitors[$goal['page_path']])) {
            return $this->visitors[$goal['page_path']];
        }

        $sequence = 'sessions::sequence::ga:landingPagePath=='.$goal['page_path'];
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

    private function getFilters($goal,$addPagePath = true)
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

    function getVariationNames($cid)
    {
        $data = array();
        $campaign = $this->campaignService->getCampaignDataByID($cid);

        foreach($campaign['variations'] as $vid => $variation) {
            $data[$variation['id']] = $variation['name'];
        }
        return $data;
    }

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

    function displayTrafficReport()
    {
        return function (Application $app, Request $request) {
            $campaign_id = $app['session']->get('campaign_id');
            $days_running = 0;
            $start_date = $this->campaignService->getStartDate($campaign_id);
            $is_running = $this->campaignService->isCampaignRunning($campaign_id);
            $vnames = $this->getVariationNames($campaign_id);

            if($is_running) {
                $now = time(); // or your date as well
                $start_date = strtotime($start_date);
                $datediff = $now - $start_date;

                $days_running = floor($datediff / (60 * 60 * 24));
            }
//            if ($app['cache']->contains('traffic-'.$campaign_id)) {
//                $body = $app['cache']->fetch('traffic-'.$campaign_id);
//            } else {
                $vids = $this->getVariationIds($campaign_id);
                $prefix = 'ga:eventLabel==ABTest-' . $campaign_id . ':';
                $filters = $prefix . implode(',' . $prefix, $vids);
               // $filters = 'ga:eventLabel==ABTest-63:Control,ga:eventLabel==ABTest-63:Variation 1';
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
                //$app['cache']->save('traffic-'.$campaign_id, $body,20);
            //}
            return $body;//new Response($body, 200, array('Cache-Control' => 's-maxage=3600, public'));
        };
    }

    public function setStartDate()
    {
        return function (Application $app, Request $request) {
            $r = $request->get('campaign_start_date');
                $app['session']->set('campaign_start_date',$request->get('campaign_start_date'));
                $app['session']->set('campaign_end_date',$request->get('campaign_end_date'));
                return $app->json(['ret' => false, 'data' => ': ']);

        };
    }
}