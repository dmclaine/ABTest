<?php
namespace src\service;
use Silex\Application;
class AnalyticsService
{

    /**
     * @var mixed  $campaignModel src\campaignModel
     */


    public $client;
    private $analyticsModel;
    private $app;
    private $oauth;

    function __construct(Application $app)
    {
        $this->analyticsModel = $app['AnalyticsModel'];
        $this->app = $app;
        // Create the client object and set the authorization configuration
        // from the client_secrets.json you downloaded from the Developers Console.
        $this->client = new \Google_Client();
        $this->client->setAuthConfig( __DIR__ . '/../../config/analytics-credentials.json');
        $this->client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/analytics/authCallback');
        $this->client->setAccessType('offline');
        $this->client->setScopes(array(\Google_Service_Analytics::ANALYTICS_READONLY, \Google_Service_Oauth2::USERINFO_PROFILE));

        //Create an authorized analytics service object.
        $this->analyticsReporting = new \Google_Service_AnalyticsReporting($this->client);
        $this->analytics = new \Google_Service_Analytics($this->client);
        //$this->me = new \Google_Service_Plus($this->client);
        $this->oauth = new \Google_Service_Oauth2($this->client);
    }

    function getAuthData($campaign_id)
    {
        static $data = null;
        if ($data === null) {
            $authData =  $this->analyticsModel->getAuthData($campaign_id);
            if($authData === null) {
                return array();
            }
            $data =  array_merge($authData, $this->validateAuthData($authData));
        }
        return $data;

    }

    function removeAnalytics($campaign_id)
    {
        return $this->analyticsModel->removeAnalytics($campaign_id);
    }

    function getSelectedProperties($campaign_id)
    {
        return $this->analyticsModel->getSelectedProperties($campaign_id);
    }

    function getAccounts($campaign_id)
    {
        $data = array('accounts' => array(), 'properties' => array(), 'profiles' => array());
        try {
            $accounts = $this->analytics->management_accountSummaries->listManagementAccountSummaries();

            foreach ($accounts->getItems() as $account) {
                $item = array();
                $account_id = $item['id'] = $account->getId();
                $item['name'] = $account->getName();
                $data['accounts'][] = $item;

                foreach ($account->getWebProperties() as $property) {
                    $item = array();
                    $item['account_id'] = $account_id;
                    $property_id = $item['id'] = $property->getId();
                    $item['name'] = $property->getName();
                    $data['properties'][$account_id][] = $item;

                    foreach ($property->getProfiles() as $profile) {
                        $item = array();
                        $item['property_id'] = $property_id;
                        $item['id'] = $profile->getId();
                        $item['name'] = $profile->getName();
                        $data['profiles'][$property_id][] = $item;
                    }
                }
            }
            return $data;
        }
        catch (apiServiceException $e)
        {
        print 'There was an Analytics API service error ' . $e->getCode() . ':' . $e->getMessage();
        }
        catch (apiException $e) {
            print 'There was a general API error ' . $e->getCode() . ':' . $e->getMessage();
        }

    }

    function checkAccess()
    {

        // If the user has already authorized this app then get an access token
        // else redirect to ask the user to authorize access to Google Analytics.
        if ($this->app['session']->get('access_token')) {
            // Set the access token on the client.
            $this->client->setAccessToken($this->app['session']->get('access_token'));

        } else {
            $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'] . '/analytics/authCallback';
            header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
        }
    }

    function manageAuthData($data)
    {
        return $this->analyticsModel->manageAuthData($data);
    }

    public function validateAuthData($authData)
    {
        $this->app['session']->set('access_token',$authData['access_token']);
        $this->client->setAccessToken($authData['access_token']);
        $token_expired = (time() > $authData['expire_at']);

        if($token_expired) {
            $authData = $this->client->refreshToken($authData['refresh_token']);
            $authData['expire_at'] = time() + $authData['expires_in'];
            $authData['campaign_id'] = $this->app['session']->get('campaign_id');
            $this->app['session']->set('access_token',$authData['access_token']);
            $id = $this->manageAuthData($authData);
        }
        return $authData;
    }

    public function getMe()
    {
        return $userInfo = $this->oauth->userinfo->get();
    }

    function getEventProperty()
    {

    }

    function analyticsRequest($data = array())
    {
        // Create the ReportRequest object.
        $request = new \Google_Service_AnalyticsReporting_ReportRequest();

        $authData = $this->getAuthData($data['campaign_id']);

        $request->setViewId($authData['profile']);

        $this->client->setAccessToken($authData['access_token']);

        // Create the DateRange object.
        $dateRange = new \Google_Service_AnalyticsReporting_DateRange();
        $dateRange->setStartDate($this->app['session']->get('campaign_start_date'));
        $dateRange->setEndDate($this->app['session']->get('campaign_end_date'));
        $request->setDateRanges($dateRange);

        // Create the Metrics object.
        if(isset($data['metrics']) && is_array($data['metrics'])) {
            $metricsArr = array();
            foreach($data['metrics'] as $idx => $metric) {
                $metricsArr[$idx] = new \Google_Service_AnalyticsReporting_Metric();
                $metricsArr[$idx]->setExpression($metric);
                //$sessions->setAlias("sessions");
            }
            $request->setMetrics($metricsArr);
        }

        if(isset($data['sort']) && is_array($data['sort'])) {
            $order = new \Google_Service_AnalyticsReporting_OrderBy();
            $order->setFieldName($data['sort']['name']);
            $order->setSortOrder($data['sort']['order']);
            $request->setOrderBys($order);
        }
        // Create the Dimensions object.
        if(isset($data['dimensions']) && is_array($data['dimensions'])) {
            $dimensionsArr = array();
            foreach($data['dimensions'] as $idx => $dimension) {
                $dimensionsArr[$idx] = new \Google_Service_AnalyticsReporting_Dimension();
                $dimensionsArr[$idx]->setName($dimension);
                //$sessions->setAlias("sessions");
            }

            $request->setDimensions($dimensionsArr);
        }

        // Create the Sequence object.
        if(isset($data['sequence'])) {

            $segment = new \Google_Service_AnalyticsReporting_Segment();
            $segment->setSegmentId($data['sequence']);
            $request->setSegments($segment);
        }

        // Create the Filter object.
        if(isset($data['filters']) && $data['filters'] != '') {
            $request->setFiltersExpression($data['filters']);
        }


        $body = new \Google_Service_AnalyticsReporting_GetReportsRequest();
        $body->setReportRequests( array( $request) );
        $data = $this->analyticsReporting->reports->batchGet( $body );
        return $this->formatReport($data);
    }

    function formatReport($reports) {

        $data = array();
        for ( $reportIndex = 0; $reportIndex < count( $reports ); $reportIndex++ ) {
            $report = $reports[ $reportIndex ];
            $header = $report->getColumnHeader();
            $dimensionHeaders = $header->getDimensions();
            $metricHeaders = $header->getMetricHeader()->getMetricHeaderEntries();
            $rows = $report->getData()->getRows();

            for ( $rowIndex = 0; $rowIndex < count($rows); $rowIndex++) {
                $data[$rowIndex] = array();
                $row = $rows[ $rowIndex ];
                $dimensions = $row->getDimensions();
                $metrics = $row->getMetrics();
                for ($i = 0; $i < count($dimensionHeaders) && $i < count($dimensions); $i++) {
                    //print($dimensionHeaders[$i] . "-: " . $dimensions[$i] . "\n");
                    $data[$rowIndex][$dimensionHeaders[$i]] = $dimensions[$i];
                }

                for ($j = 0; $j < count( $metricHeaders ) && $j < count( $metrics ); $j++) {
                    $entry = $metricHeaders[$j];
                    $values = $metrics[$j];
                    for ( $valueIndex = 0; $valueIndex < count( $values->getValues() ); $valueIndex++ ) {
                        $value = $values->getValues()[ $valueIndex ];
                        //print($entry->getName() . ": " . $value . "\n");
                        $data[$rowIndex][$entry->getName()] = $value;
                    }
                }
            }
        }
        return $data;
    }
}