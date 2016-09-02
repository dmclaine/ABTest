<?php
namespace src\providers;
use Pimple\Container;
use Pimple\ServiceProviderInterface;
use Silex\Application;
use RedBeanPHP\Facade as R;

class RedBeanServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app)
    {
        $app['db'] = function () use ($app) {
            $options = array(
                'dsn'      => null,
                'username' => null,
                'password' => null,
                'frozen'   => false,
            );
            if (isset($app['db.options'])) {
                $options = array_replace($options, $app['db.options']);
            }
            R::setup(
                $options['dsn'],
                $options['username'],
                $options['password'],
                $options['frozen']
            );
        };
    }
}