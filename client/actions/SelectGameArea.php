<?php

namespace actions;

use lib\BaseAction;
use lib\Helper;

class SelectGameArea extends BaseAction
{
    const HOST_INFO = 'http://client.ogame.cn/';

    const ENTER_URL = self::HOST_INFO. 'enter.php?s={area}';
    const PROXY_URL = 'http://s{area}.ogame.cn/proxy.html';

    public $area;

    /**
     * @return bool
     */
    public function run()
    {
        echo 'Now entering game area '. $this->area. ' ...', PHP_EOL;
		list($code, $body, $header) = Helper::curl(str_replace('{area}', $this->area, self::ENTER_URL));
        logHtml($body, 'enter-game-area.bin');
        if ($code === 302) {
            $location = Helper::parseHttpHeader($header, 'Location');
            if (strpos($location, 'game.php') === 0) {
                $location = self::HOST_INFO. $location;
            }

            list($code, $body, $header) = Helper::curl($location);

            if ($code != 200) {
                echo 'Failed.', PHP_EOL;
                return false;
            } elseif (strpos($body, '<script') === 0) {
                echo 'Login required!', PHP_EOL;
                return false;
            }
        }

        list($code, $body) = Helper::curl(str_replace('{area}', $this->area, self::PROXY_URL));
        logHtml($body, 'open-proxy-page.bin');

        return $code == 200;
    }
}