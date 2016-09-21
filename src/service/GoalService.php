<?php
namespace src\service;
use Silex\Application;
class GoalService
{

    /**
     * @var mixed  $campaignModel src\campaignModel
     */
    private $goalModel;

    function __construct(Application $app)
    {
        $this->goalsModel = $app['GoalsModel'];
    }
    public function saveGoal($data,$campaign_id)
    {
        $defaults = $this->getDefaultGoalInputs();
        $goalData = array_merge($defaults,$data);
        return $this->goalsModel->saveGoalData($goalData,$campaign_id);
    }

    public function deleteGoal($goalId)
    {
        return $this->goalsModel->deleteGoal($goalId);
    }

    public function getGoalById($id)
    {
        if($id == 0) {
            return $this->getDefaultGoalInputs();
        }
        return $this->goalsModel->getGoalById($id);
    }

    public function getAllGoals($campaign_id)
    {
        return $campaigns = $this->goalsModel->getAllGoals($campaign_id);
    }


    private function getDefaultGoalInputs()
    {
        return array(
            'id' => 0,
            'name' => '',
            'arrive_action' => '',
            'page_path' => '',
            'type' => '',
            'action' => '',
            'action_pp_pattern' => '==',
            'action_pp' => '',
            'e_label' => '',
            'e_action' => '',
            'e_category' => '',
            'segment_sequence' => '',
            'segment_sequence_filter' => '',
            'segment_condition' => '',
            'segment_condition_filter' => ''
        );
    }

    function calculateSignificance($data,$campaign_id)
    {
        $report = array();
        $significance = array();
        foreach($data['report'] as $key => $value)
        {
            if(!isset($report[$value['ga:eventLabel']]))
            {
                $report[$value['ga:eventLabel']] = array(
                    'total_traffic' => 0,
                    'conversions' => 0
                );
            }
            $report[$value['ga:eventLabel']]['conversions'] += (int) $value['ga:sessions'];
        }



        /* Look for control and then unset it */
        $control = $report['ABTest-'.$campaign_id.':Control'];

        $control_number_conversions = $control['conversions'];

        foreach($data['participants'] as $key => $value)
        {
            $data['participants'][$value['ga:eventLabel']] = $value['ga:sessions'];
            $report[$value['ga:eventLabel']]['total_traffic'] = $value['ga:sessions'];
            unset($data['participants'][$key]);
        }
        $control_number_visitors = (int) $data['participants']['ABTest-'.$campaign_id.':Control'];
        unset($data['participants']['ABTest-'.$campaign_id.':Control']);
        //unset($report['ABTest-'.$campaign_id.':Control']);
        foreach($report as $key => $value)
        {
            $treatment_number_visitors = (int) $value['total_traffic'];
            $treatment_number_conversions = (int) $value['conversions'];
            $calculator = new Calculator();
            $significance[$key] =  $calculator->calculate($control_number_visitors, $control_number_conversions, $treatment_number_visitors, $treatment_number_conversions);

        }

        return $significance;

    }
}

class Calculator
{

    function cr($t)
    {
        return ($t[0] == 0) ? 0 : $t[1]/$t[0];
    }

    function zscore($c, $t)
    {
        $z = $this->cr($t)-$this->cr($c);
        $s = (($t[0] == 0) ? 0 : ($this->cr($t)*(1-$this->cr($t)))/$t[0]) + (($c[0] == 0) ? 0: ($this->cr($c)*(1-$this->cr($c)))/$c[0]);
        return $z/sqrt($s);
    }
    function cumnormdist($x)
    {
        $b1 =  0.319381530;
        $b2 = -0.356563782;
        $b3 =  1.781477937;
        $b4 = -1.821255978;
        $b5 =  1.330274429;
        $p  =  0.2316419;
        $c  =  0.39894228;
        if($x >= 0.0) {
            $t = 1.0 / ( 1.0 + $p * $x );
            return (1.0 - $c * exp( -$x * $x / 2.0 ) * $t *
                ( $t *( $t * ( $t * ( $t * $b5 + $b4 ) + $b3 ) + $b2 ) + $b1 ));
        }
        else {
            $t = 1.0 / ( 1.0 - $p * $x );
            return ( $c * exp( -$x * $x / 2.0 ) * $t *
                ( $t *( $t * ( $t * ( $t * $b5 + $b4 ) + $b3 ) + $b2 ) + $b1 ));
        }
    }
    function ssize($conv)
    {
        $a = 3.84145882689;
        $res = array();
        $bs = array(0.0625, 0.0225, 0.0025);
        foreach ($bs as $b) {
            $res[] = (int) ((1-$conv)*$a/($b*$conv));
        }
        return $res;
    }
    function calculate($control_number_visitors, $control_number_conversions, $treatment_number_visitors, $treatment_number_conversions)
    {

        if($treatment_number_conversions == 0) {
            return array(
                "control"=>array(),
                "variation" => array(
                    "visitor" => 0,
                    "conversions" => 0,
                    "conversion_rate" => 0,
                    "z_score"	=> 0,
                    "confidence"	=> 0,
                    "uplift" => 0
                )
            );
        }
        $c  = array($control_number_visitors, $control_number_conversions);
        $tA = array($treatment_number_visitors, $treatment_number_conversions);
        // Calculate conversion rates.
        $c_conversion_rate  = ($control_number_visitors == 0) ? 0 : ($control_number_conversions / $control_number_visitors) * 100;
        $tA_conversion_rate = ($treatment_number_visitors == 0) ? 0 :($treatment_number_conversions  / $treatment_number_visitors) * 100;
        $c_conversion_rate = $c_conversion_rate . '%';
        $tA_conversion_rate = $tA_conversion_rate . '%';
        // The z-score is ... [explain]
        $zscore = $this->zscore($c, $tA);
        // Calculate the 'cumulative normal distribution' (confidence ratio)
        $confidence = $this->cumnormdist($zscore);
        // If the 'confidence interval is >95%', the test is statistically significant.
        $confidence_as_percentage = $confidence * 100;
        // Pad the strings for output
        $cV = str_pad($control_number_visitors, 16, ' ', STR_PAD_BOTH);
        $cC = str_pad($control_number_conversions, 11, ' ', STR_PAD_BOTH);
        $tV = str_pad($treatment_number_visitors, 16, ' ', STR_PAD_BOTH);
        $tC = str_pad($treatment_number_conversions, 11, ' ', STR_PAD_BOTH);
        $cr_c = str_pad(sprintf('%0.2f', $c_conversion_rate), 15, ' ', STR_PAD_BOTH);
        $cr_t = str_pad($tA_conversion_rate, 15, ' ', STR_PAD_BOTH);
        $zs = str_pad($zscore, 15, ' ', STR_PAD_BOTH);
        $cratio = str_pad((sprintf('%0.2f', $confidence) * 100) . '%', 10, ' ', STR_PAD_BOTH);


        return	array(
            "control" => array(
                "visitor" => $cV,
                "conversions" => $cC,
                "conversion_rate" => $cr_c,
                "z_score"	=> "",
                "confidence"	=> "",
                "uplift"	=> ""
            ),
            "variation" => array(
                "visitor" => $tV,
                "conversions" => $tC,
                "conversion_rate" => $cr_t,
                "z_score"	=> $zs,
                "confidence"	=> $cratio,
                "uplift"	=> ($cr_c == 0)? 0 : (($cr_t/$cr_c) - 1)*100
            )

        );
    }
}