<?php
namespace src\application;
use Silex\Application;

/**
 * Class MyApplication
 * @package src\application
 * @author Abhishek Saha <abhishek.saha@rocket-internet.de>
 * @Date    ${DATE}
 */
class MyApplication extends Application
{
    use Application\TwigTrait;
    use Application\SecurityTrait;
    use Application\FormTrait;
    use Application\UrlGeneratorTrait;
    use Application\SwiftmailerTrait;
    use Application\MonologTrait;
    use Application\TranslationTrait;
}