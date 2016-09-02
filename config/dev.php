<?php
//use Silex\Provider\MonologServiceProvider;
//use Silex\Provider\WebProfilerServiceProvider;
$app['twig.path'] = array(__DIR__ . '/../src/templates');
$app['twig.options'] = array('cache' => __DIR__ . '/../var/cache/twig');
$app['db.options'] = array(
    'dsn'      => 'mysql:host=localhost;dbname=NewABTest',
    'username' => 'root',
    'password' => '123456',
    'frozen'   => false
);
require __DIR__ . '/security.php';
// enable the debug mode
$app['debug'] = true;
//$app->register(new MonologServiceProvider(), array(
//    'monolog.logfile' => __DIR__ . '/../var/logs/silex_dev.log',
//));
//$app->register(new WebProfilerServiceProvider(), array(
//    'profiler.cache_dir' => __DIR__ . '/../var/cache/profiler',
//));