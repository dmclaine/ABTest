<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class UserController implements ControllerProviderInterface
{

    /* var @$userService src\service\UserService */
    private $userService;

    public function __construct(Application $app)
    {
        $this->userService = $app['UserService'];
    }
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];
        $controllers->post('/authenticate', $this->authenticateUser());
        $controllers->get('/logout', $this->logoutUser());
        return $controllers;
    }

    public function authenticateUser()
    {
        return function (Application $app) {
            $request = $app['request_stack']->getCurrentRequest();
            $email = $request->request->get('email');
            $password = ($request->request->get('password'));
            $out = $this->userService->validateUser($email, $password);
            if($out['success'] == 1)
            {
                $app['session']->set('user',$out);
                return $app->redirect('/dashboard');
            }
            return $app->json($out);
        };
    }

    public function logoutUser()
    {
        return function (Application $app) {
            $app['session']->clear();
            $app['session']->getFlashBag()->add('msg', 'User logged out successfully');
            return $app->redirect('/');
        };
    }
}