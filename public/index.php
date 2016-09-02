<?php

ini_set('display_errors', 0);
require_once __DIR__ . '/../vendor/autoload.php';
date_default_timezone_set('UTC');

//register 3rd party services
$app = require __DIR__ . '/../src/App.php';
//load prod environment configuration
require __DIR__ . '/../config/dev.php';
//dependency injection
require __DIR__ . '/../src/Services.php';
//controller routers
require __DIR__ . '/../src/Routers.php';
$app['debug'] = true;
$app->run();

?>