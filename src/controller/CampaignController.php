<?php
namespace src\controller;
use Silex\Application;

use Silex\Controller;
use Symfony\Component\HttpFoundation\Request;


/**
 * Class CampaignController
 * @package src\controller
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class CampaignController
{
    /**
     * @var mixed
     */
    private $campaignService;
    /**
     * @var mixed
     */
    private $userService;
    /**
     * @var Application
     */
    private $app;
    /**
     * @var Request
     */
    private $request;

    /**
     * CampaignController constructor.
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;

        $this->request = Request::createFromGlobals();
        $this->campaignService = $app['CampaignService'];
        $this->userService = $app['UserService'];

    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function saveCampaign(Request $request)
    {
        try {
            $account_id = 0;
            if(isset($this->app['session']->get('user')['account'][0])) {
                $account_id = $this->app['session']->get('user')['account'][0]['account_id'];
            }
            $user_id = $this->app['session']->get('user')['user_id'];
            $data = $request->get('data');
            $data['account_id'] = $account_id;
            $data['created_by'] = $user_id;
            $data = $this->campaignService->save($data);
            return $this->app->json(['ret' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function powerCampaign(Request $request)
    {
        try {
            $data = $request->get('data');
            $affected = $this->campaignService->powerCampaign($data);
            $this->userService->insertLog(array(
                'code' => 'STATUS_CHANGE',
                'value' => $data['status'],
                'campaign_id' => $data['campaign_id']
            ));
            // check if campaign start_date action is entered. This is a one time action.
            // We dont set it more than once from here..

            $start_date = $this->campaignService->getStartDate($data['campaign_id']);
            if($start_date == null) {
                $logs = $this->userService->getLogs(array(
                    'campaign_id' => $data['campaign_id'],
                    'code' => 'STATUS_CHANGE',
                    'order_type' => 'ASC',
                    'order_by'  => 'created'
                ));
                foreach($logs as $item) {
                    if($item['value'] == 1) {
                        $item['start_date'] = date('Y-m-d');
                        $this->campaignService->setStartdate($item);
                        break;
                    }
                }
            }


            return $this->app->json(['ret' => true, 'data' => $affected]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getCampaignDataByID()
    {
        try {
            $id = $this->request->request->get('id');
            $data = $this->campaignService->getCampaignDataByID($id);
            return $this->app->json(['ret' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

    /**
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getAllCampaigns()
    {
        try {
            $account = $this->app['session']->get('user')['account'];
            $data = $this->campaignService->getAllCampaigns(array(
                'archived' => 0,
                'account' => $account
            ));
            return $this->app->json(['ret' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

}