<?php
$app['twig.path'] = array(__DIR__ . '/../src/templates');
$app['twig.options'] = array('cache' => __DIR__ . '/../var/cache/twig');
$app['db.options'] = array(
    'dsn'      => 'mysql:host=localhost;dbname=NewABTest',
    'username' => 'root',
    'password' => 'rock4me',
    'frozen'   => true
);
require __DIR__ . '/security.php';