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
        $this->client->addScope(\Google_Service_Analytics::ANALYTICS_READONLY);

        //Create an authorized analytics service object.
        $this->analyticsReporting = new \Google_Service_AnalyticsReporting($this->client);
        $this->analytics = new \Google_Service_Analytics($this->client);

    }

    function getAuthData($campaign_id)
    {
        $authData =  $this->analyticsModel->getAuthData($campaign_id);
        if($authData === null) {
            return array();
        }
        return array_merge($authData, $this->validateAuthData($authData));
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
            $this->app['session']->set('access_token',$authData['access_token']);
            $id = $this->manageAuthData($authData);
        }
        return $authData;
    }

    function getEventProperty($data = array())
    {
        $params = array(
            'dimensions' => $data['dimensions'] //'ga:eventAction',
            //'ga:eventCategory=='.$category.';ga:eventAction=='.$action,
        );
        if(isset($data['filter']))
        {
            $params['filter'] = $data['filter'];
        }
        $authData = $this->getAuthData($data['campaign_id']);

        $this->client->setAccessToken($authData['access_token']);

        //try

        // Replace with your view ID, for example XXXX.
        $VIEW_ID = "<REPLACE_WITH_VIEW_ID>";

        // Create the DateRange object.
        $dateRange = new \Google_Service_AnalyticsReporting_DateRange();
        $dateRange->setStartDate("7daysAgo");
        $dateRange->setEndDate("today");

        // Create the Metrics object.
        $sessions = new \Google_Service_AnalyticsReporting_Metric();
        $sessions->setExpression("ga:sessions");
        $sessions->setAlias("sessions");

        // Create the Dimensions object.
        $dimensions = new \Google_Service_AnalyticsReporting_Dimension();
        $dimensions->setName("ga:eventCategory");

        // Create the ReportRequest object.
        $request = new \Google_Service_AnalyticsReporting_ReportRequest();
        $request->setViewId('119394431');
        $request->setDateRanges($dateRange);
        $request->setMetrics(array($sessions));
        $request->setDimensions(array($dimensions));

        $body = new \Google_Service_AnalyticsReporting_GetReportsRequest();
        $body->setReportRequests( array( $request) );
        $body = $this->analytics->reports->batchGet( $body );

        //end try
        $events = $this->analytics->data_ga->get('ga:'.$authData['account'], '30daysAgo', 'today','ga:sessions');

        $out = array('labels' => array());

        $rows = $events->getRows();
print_r($rows);
        if(isset($rows))
        {
            foreach($events['rows'] as $event)
            {
                $out['labels'][$event[0]] = $event[0];
            }
        }
        return ($data['format'] == 'array') ? $out : json_encode($out);
    }
}