<?php
use Symfony\Component\HttpFoundation\Request;
//Request::setTrustedProxies(array('127.0.0.1'));

//$app['controllers']->before(function() use ($app){
//    if($app['session']->hasFlash('msg'))
//    {
//        $msg = $app['session']->getFlash('msg');
//        $app['twig']->addGlobal('msg', $msg);
//    }
//});

$app->get('/', function () use ($app) {
    if(!$app['session']->get('user')) {
        return $app['twig']->render('login.html');
    }
    return $app->redirect('/dashboard/campaigns');
});

$app->get('/col', function () use ($app) {
    return $app['twig']->render('index.html');
});

$app['controllers']->before(function (Request $request) {
    if (strpos($request->headers->get('Content-Type'), 'application/json') === 0) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->mount('/dashboard', $app['DashboardController']);

$app->mount('/analytics', $app['AnalyticsController']);
$app->mount('/reporting', $app['ReportingController']);

$app->mount('/goal', $app['GoalController']);

$app->post('/campaign/save', function() use ($app) {
    return ($app['CampaignController']->saveCampaign());
});

$app->put('/campaign/power', function() use ($app) {
    return ($app['CampaignController']->powerCampaign());
});

$app->mount('/user', $app['UserController']);