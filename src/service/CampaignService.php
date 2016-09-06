<?php
namespace src\service;
use Silex\Application;
class CampaignService
{

    /**
     * @var mixed  $campaignModel src\campaignModel
     */
    private $campaignModel;

    function __construct(Application $app)
    {
        $this->campaignModel = $app['CampaignModel'];
    }
    public function save($data)
    {
        return $this->campaignModel->save($data);
    }

    public function getCampaignDataByID($id)
    {
        return $this->formatCampaign($this->campaignModel->getCampaignDataByID($id));
    }

    public function getAllCampaigns($type="")
    {
        return $campaigns = $this->campaignModel->getAllCampaigns($type);
        //return $this->formatCampaign($campaigns);
    }

    public function powerCampaign($status)
    {
        return $this->campaignModel->powerCampaign($status);
    }

    private function formatCampaign($campaigns)
    {
        $campaigns['user'] = json_decode($campaigns['user'],true);
        $campaigns['url'] = json_decode($campaigns['url'],true);
        $campaigns['device'] = json_decode($campaigns['device'],true);
        $campaigns['browser'] = json_decode($campaigns['browser'],true);
        $campaigns['geographic'] = json_decode($campaigns['geographic'],true);
        $campaigns['cookie'] = json_decode($campaigns['cookie'],true);
        $campaigns['ip'] = json_decode($campaigns['cookie'],true);
        $campaigns['language'] = json_decode($campaigns['cookie'],true);
        $campaigns['script'] = json_decode($campaigns['script'],true);
        return $campaigns;
    }
}