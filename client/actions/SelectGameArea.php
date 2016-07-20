<?php

namespace actions;

use lib\BaseAction;
use lib\Client;
use lib\Helper;

class SelectGameArea extends BaseAction
{

    const ENTER_URL = 'http://client.ogame.cn/enter.php?s={area}';
    const PROXY_URL = 'http://s{area}.ogame.cn/proxy.html';

    public $area;

    /**
     * @return Client
     */
    public function run()
    {
        echo 'Now entering game area '. $this->area. ' ...', PHP_EOL;
        usleep(100000);
		$content = Helper::curl(str_replace('{area}', $this->area, self::ENTER_URL));
        if (strpos($content, '<script') === 0) {
            echo 'Login required!', PHP_EOL;
            return false;
        }

        logHtml($content, 'enter-game-area.bin');
        
        usleep(100000);
        $content = Helper::curl(str_replace('{area}', $this->area, self::PROXY_URL));
        logHtml($content, 'open-proxy-page.bin');

    }
}