<?php
namespace src\service;
use Silex\Application;
use src\model\CampaignModel;

/**
 * Class CampaignService
 * @package src\service
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class CampaignService
{

    /**
     * @var CampaignModel
     */
    private $campaignModel;

    /**
     * CampaignService constructor.
     * @param Application $app
     */
    function __construct(Application $app)
    {
        $this->campaignModel = $app['CampaignModel'];
    }

    /**
     * @param $data
     * @return mixed
     */
    public function save($data)
    {
        $defaults = $this->getDefaultTargets();
        $data['targets']['user'] = array_merge($defaults['user'],$data['targets']['user']);
        $data['targets']['ip'] = isset($data['targets']['ip']) ? array_merge($defaults['ip'],$data['targets']['ip']) : $defaults['ip'];
        $data['targets']['browser'] = array_merge($defaults['browser'],$data['targets']['browser']);
        $data['targets']['device'] = array_merge($defaults['device'],$data['targets']['device']);
        $data['targets']['script'] = array_merge($defaults['script'], $data['targets']['script']);
        $data['targets']['language'] = isset($data['targets']['language']) ? array_merge($defaults['language'], $data['targets']['language']) :$defaults['language'];
        $data['targets']['cookie'] = isset($data['targets']['cookie']) ? array_merge($defaults['cookie'], $data['targets']['cookie']) :$defaults['cookie'];

        return $this->campaignModel->save($data);
    }

    /**
     * @param $campaign_id
     * @return mixed
     */
    public function isAnalyticsConnected($campaign_id)
    {
        return $this->campaignModel->isAnalyticsConnected($campaign_id);
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getCampaignDataByID($id)
    {
        static $campaign = array();

        if(isset($campaign[$id])) {
            return $campaign[$id];
        }
        $data = $this->formatCampaign($this->campaignModel->getCampaignDataByID($id));
        $campaign[$id] = $data;

        return $campaign[$id];
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function getAllCampaigns($data=array())
    {
        return $campaigns = $this->campaignModel->getAllCampaigns($data);
    }

    /**
     * @param $accounts
     * @return mixed
     */
    public function getRunningCampaigns($accounts)
    {
        return $campaigns = $this->campaignModel->getRunningCampaigns($accounts);
    }

    /**
     * @param $campaign_id
     * @return mixed
     */
    public function isCampaignRunning($campaign_id)
    {
        return $this->campaignModel->isCampaignRunning($campaign_id);
    }

    /**
     * @param $campaign_ids
     * @return mixed
     */
    public function doArchive($campaign_ids)
    {
        return $this->campaignModel->doArchive($campaign_ids);
    }

    /**
     * @param $campaign_ids
     * @return mixed
     */
    public function doDuplicate($campaign_ids)
    {
        return $this->campaignModel->doDuplicate($campaign_ids);
    }


    /**
     * @param $status
     * @return mixed
     */
    public function powerCampaign($status)
    {
        return $this->campaignModel->powerCampaign($status);
    }

    /**
     * @param $data
     */
    public function setStartDate($data)
    {
        $this->campaignModel->setStartDate($data);
    }

    /**
     * @param $campaign_id
     * @return mixed
     */
    public function getStartDate($campaign_id)
    {
        return $this->campaignModel->getStartData($campaign_id);
    }

    /**
     * @param $campaigns
     * @return mixed
     */
    private function formatCampaign($campaigns)
    {
        $campaigns['user'] = json_decode($campaigns['user'],true);
        $campaigns['url'] = json_decode($campaigns['url'],true);
        $campaigns['device'] = json_decode($campaigns['device'],true);
        $campaigns['browser'] = json_decode($campaigns['browser'],true);
        $campaigns['geographic'] = json_decode($campaigns['geographic'],true);
        $campaigns['cookie'] = json_decode($campaigns['cookie'],true);
        $campaigns['ip'] = json_decode($campaigns['ip'],true);
        $campaigns['language'] = json_decode($campaigns['language'],true);
        $campaigns['script'] = json_decode($campaigns['script'],true);
        return $campaigns;
    }

    /**
     * @return array
     */
    private function getDefaultTargets()
    {
        $targets = array(
            'user' => array(
                'all_users' => 'true',
                'new_users' => 'false',
                'returning_users' => 'false'
            ),
            'url' => array(
                'url' => array(),
                'url_contains' => array(),
                'url_excludes' => array()
            ),
            'device' => array(
                'allow_desktop' => 'true',
                'allow_mobile' => 'true',
                'allow_tablet' => 'true'
            ),
            'browser' => array(
                'IE' => false,
                'Chrome' => false,
                'Safari' => false,
                'Firefox' => false,
                'Opera' => false,
            ),
            'cookie' => array(
                'exclude_cookie' => array(),
                'include_cookie' => array()
            ),
            'ip' => array(
                'include_ips' => array(),
                'exclude_ips' => array()
            ),
            'language' => array(
                'allowed_languages' => array(),
                'exclude_languages' => array()
            ),
            'script' => array(
                'js' => ''
            )
        );

        return $targets;
    }
}