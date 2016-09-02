<?php
use src\application\MyApplication;
use src\application\MyRoute;
use Silex\Application;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\HttpFragmentServiceProvider;
use Silex\Provider\SecurityServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\SwiftmailerServiceProvider;
use Silex\Provider\TwigServiceProvider;
//use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Route;
use Symfony\Component\HttpFoundation\Request;

use src\providers\RedBeanServiceProvider;

$app = new MyApplication();
//print_r($app['security.firewalls']);

$app['route_class'] = new MyRoute();
$app->register(new ValidatorServiceProvider());
$app->register(new ServiceControllerServiceProvider());
$app->register(new TwigServiceProvider());
$app->register(new HttpFragmentServiceProvider());
//$app->register(new UrlGeneratorServiceProvider());
$app->register(new DoctrineServiceProvider());

//$app->register(new SecurityServiceProvider());
$app->register(new SessionServiceProvider());
$app->register(new SwiftmailerServiceProvider());

//$userServiceProvider = new SimpleUser\UserServiceProvider();
$app->register(new RedBeanServiceProvider());
//$app->register($userServiceProvider);

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/templates',
));

$app['twig']->addGlobal('base_path', '/');
$app['twig']->addExtension(new Twig_Extension_Debug());

return $app;