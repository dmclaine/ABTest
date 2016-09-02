<?php
namespace src\model;
use Silex\Application;
use RedBeanPHP\Facade as R;

class CampaignModel
{
    function __construct(Application $app)
    {
        //initialize
        $app['db'];
    }
    public function getCampaignDataByID($id)
    {
        $data = R::getRow("SELECT * FROM campaigns c INNER JOIN rules r ON c.id = r.campaign_id WHERE c.id=$id");
        foreach($data as $key => $value)
        {
            if($this->is_serialized($value)) {
                $array = @unserialize($value);
                $data[$key] = $array;
            }
        }
        return $data;
    }

    public function getAllCampaigns($type="")
    {
        $sql = 'SELECT * FROM campaigns';
        if($type != "")
        {
            $sql .= " WHERE flag = '$type'";
        }
        return R::getAll($sql);
    }

    public function save($data)
    {
        //Store Campaigns
        $campaign = (isset($data['id'])) ? R::load('campaigns',$data['id']) : R::dispense('campaigns');
        $campaign_data = $data['general']['general-settings'];
        $variations_data = $data['variations'];
        foreach($campaign_data as $col => $value) {
            $campaign->$col = $value;
        }
        $campaign->variations = serialize($variations_data);
        $id = R::store($campaign);

        $campaign_id = (isset($data['id'])) ? $data['id'] : $id;
        //store campaign rules

        if(isset($data['id'])) {
            $rules_id = R::getCell('SELECT id FROM rules WHERE campaign_id=?',array($campaign_id));
            $rules = R::load('rules',$rules_id);
        }else{
            $rules = R::dispense('rules');
        }

        $rules_data = $data['rules'];

        $rules['campaign_id'] = $id;
        foreach($rules_data as $col => $value) {
            $rules->$col = json_encode($value);
        }
        R::store($rules);

        // store analytics data
        $analytics_data = $data['analytics'];
        if(count($analytics_data) > 0) {
            $analytics_id = R::getCell('SELECT id FROM analytics WHERE campaign_id=?',array($campaign_id));
            $analytics = R::load('analytics',$analytics_id);
            $analytics_data['campaign_id'] = $id;
            foreach ($analytics_data as $col => $value) {
                $analytics->$col = $value;
            }
            R::store($analytics);
        }
        return array(
            'success' => "from model"
        );
    }

    public function powerCampaign($data)
    {
        return R::exec('UPDATE campaigns SET status=? WHERE id=?', array($data['status'],$data['campaign_id']));
    }

    function is_serialized( $data, $strict = true ) {
        // if it isn't a string, it isn't serialized.
        if ( ! is_string( $data ) ) {
            return false;
        }
        $data = trim( $data );
        if ( 'N;' == $data ) {
            return true;
        }
        if ( strlen( $data ) < 4 ) {
            return false;
        }
        if ( ':' !== $data[1] ) {
            return false;
        }
        if ( $strict ) {
            $lastc = substr( $data, -1 );
            if ( ';' !== $lastc && '}' !== $lastc ) {
                return false;
            }
        } else {
            $semicolon = strpos( $data, ';' );
            $brace     = strpos( $data, '}' );
            // Either ; or } must exist.
            if ( false === $semicolon && false === $brace )
                return false;
            // But neither must be in the first X characters.
            if ( false !== $semicolon && $semicolon < 3 )
                return false;
            if ( false !== $brace && $brace < 4 )
                return false;
        }
        $token = $data[0];
        switch ( $token ) {
            case 's' :
                if ( $strict ) {
                    if ( '"' !== substr( $data, -2, 1 ) ) {
                        return false;
                    }
                } elseif ( false === strpos( $data, '"' ) ) {
                    return false;
                }
            // or else fall through
            case 'a' :
            case 'O' :
                return (bool) preg_match( "/^{$token}:[0-9]+:/s", $data );
            case 'b' :
            case 'i' :
            case 'd' :
                $end = $strict ? '$' : '';
                return (bool) preg_match( "/^{$token}:[0-9.E-]+;$end/", $data );
        }
        return false;
    }
}