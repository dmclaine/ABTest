<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;


class CampaignController
{
    private $campaignService;
    private $app;
    private $request;

    public function __construct(Application $app)
    {
        $this->app = $app;

        $this->request = Request::createFromGlobals();
        $this->campaignService = $app['CampaignService'];

    }

    public function saveCampaign()
    {
        try {
            $data = $this->request->request->get('data');
            $data = $this->campaignService->save($data);
            return $this->app->json(['ret' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

    public function powerCampaign()
    {
        try {
            $data = $this->request->request->get('data');
            $affected = $this->campaignService->powerCampaign($data);
            return $this->app->json(['ret' => true, 'data' => $affected]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }

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

    public function getAllCampaigns()
    {
        try {
            $data = $this->campaignService->getAllCampaigns();
            return $this->app->json(['ret' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return $this->app->json(['ret' => false, 'data' => 'error: ' . $e->getMessage()]);
        }
    }
}