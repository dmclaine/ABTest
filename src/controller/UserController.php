<?php
namespace src\controller;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;


/**
 * Class UserController
 * @package src\controller
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class UserController implements ControllerProviderInterface
{

    /* var @$userService src\service\UserService */
    /**
     * @var mixed
     */
    private $userService;

    /**
     * UserController constructor.
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->userService = $app['UserService'];
    }

    /**
     * @param Application $app
     * @return mixed
     */
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];
        $controllers->post('/authenticate', $this->authenticateUser());
        $controllers->get('/logout', $this->logoutUser());
        return $controllers;
    }

    /**
     * @return \Closure
     */
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
                return $app->redirect('/dashboard/campaigns');
            }
            return $app->json($out);
        };
    }

    /**
     * @return \Closure
     */
    public function logoutUser()
    {
        return function (Application $app) {
            $app['session']->clear();
            //$app['session']->getFlashBag()->add('msg', 'User logged out successfully');
            return $app->redirect('/');
        };
    }
}