<?php
/**********************************************************************
 * Dependency Injections
 **********************************************************************/
//Controllers
/**
 * @param $app
 * @return \src\controller\DashboardController
 */
$app['DashboardController'] = function ($app) {
    return new src\controller\DashboardController($app);
};

/**
 * @param $app
 * @return \src\controller\CampaignController
 */
$app['CampaignController'] = function ($app) {
    return new src\controller\CampaignController($app);
};

/**
 * @param $app
 * @return \src\controller\AnalyticsController
 */
$app['AnalyticsController'] = function ($app) {
    return new src\controller\AnalyticsController($app);
};

/**
 * @param $app
 * @return \src\controller\GoalController
 */
$app['GoalController'] = function ($app) {
    return new src\controller\GoalController($app);
};

/**
 * @param $app
 * @return \src\controller\UserController
 */
$app['UserController'] = function ($app) {
    return new src\controller\UserController($app);
};
//Services
/**
 * @param $app
 * @return \src\service\UserService
 */
$app['UserService'] = function ($app) {
    return new \src\service\UserService($app);
};
/**
 * @param $app
 * @return \src\service\CampaignService
 */
$app['CampaignService'] = function ($app) {
    return new \src\service\CampaignService($app);
};

/**
 * @param $app
 * @return \src\service\AnalyticsService
 */
$app['AnalyticsService'] = function ($app) {
    return new \src\service\AnalyticsService($app);
};

//Models
/**
 * @param $app
 * @return \src\model\UserModel
 */
$app['UserModel'] = function ($app) {
    return new \src\model\UserModel($app);
};

/**
 * @param $app
 * @return \src\model\CampaignModel
 */
$app['CampaignModel'] = function ($app) {
    return new \src\model\CampaignModel($app);
};

/**
 * @param $app
 * @return \src\model\AnalyticsModel
 */
$app['AnalyticsModel'] = function ($app) {
    return new \src\model\AnalyticsModel($app);
};