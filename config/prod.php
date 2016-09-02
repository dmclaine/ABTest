<?php
// configure your app for the production environment
$app['twig.path'] = array(__DIR__ . '/../templates');
$app['twig.options'] = array('cache' => __DIR__ . '/../var/cache/twig');
$app['db.options'] = array(
    'driver' => 'pdo_mysql',
    'host' => 'localhost',
    'dbname' => 'db_prod',
    'user' => 'user',
    'password' => 'userpass',
    'charset' => 'utf8',
);
require __DIR__ . '/security.php';