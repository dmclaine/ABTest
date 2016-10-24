<?php

ini_set('display_errors', 0);
require_once __DIR__ . '/../vendor/autoload.php';
date_default_timezone_set('UTC');

//register 3rd party services
$app = require __DIR__ . '/../src/App.php';
//load prod environment configuration
if(getenv('NODE_ENV') != null && getenv('NODE_ENV') == 'dev')
{
    require __DIR__ . '/../config/dev.php';
    $app['debug'] = true;
}
else
{
    require __DIR__ . '/../config/prod.php';
}
//dependency injection
require __DIR__ . '/../src/Services.php';
//controller routers
require __DIR__ . '/../src/Routers.php';

$app->run();
?>