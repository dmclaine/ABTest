<?php
//$app['security.firewalls'] = array(
//    'secured_area' => array(
//        'pattern' => '^.*$',
//        'anonymous' => true,
//        'form' => array(
//            'login_path' => '/simple-user/login',
//            'check_path' => '/simple-user/login_check',
//        ),
//        'users' => $app->share(function ($app) {
//            return $app['user.manager'];
//        }),
//    ),
//);

$app['security.firewalls'] = array(
    'admin' => array(
        'pattern' => '^.*$',
        'http' => true,
        'users' => array(
            // raw password is foo
            'admin' => array('ROLE_ADMIN', '$2y$10$3i9/lVd8UOFIJ6PAMFt8gu3/r5g0qeCJvoSlLCsvMTythye19F77a'),
        ),
    ),
);