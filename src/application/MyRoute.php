<?php
namespace src\Application;
use Silex\Route;

/**
 * Class MyRoute
 * @package src\Application
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class MyRoute extends Route
{
    use Route\SecurityTrait;
}