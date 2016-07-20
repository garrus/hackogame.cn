<?php
namespace actions;

use lib\BaseAction;
use lib\Helper;

class Login extends BaseAction{

	//const LOGIN_FORM_URL = 'http://user.ogame.cn/userframe.php';
	const LOGIN_URL = 'http://user.ogame.cn/logging.php?action=login';

	public $username;
	public $password;

	public function run(){

		echo 'Login as user "'. $this->username. '" ... ', PHP_EOL;
		$content = Helper::curl(self::LOGIN_URL, [
			'passport' => $this->username,
			'password' => $this->password,
			'loginsubmit' => ' 登录 ',
			'cookietime' => '315360000',
			'inform' => '1',
		], $this->getHeaders());
		
		logHtml($content, 'login.bin');
		
		if (strpos($content, 'alert') === false) {
			echo 'Login is a success!', PHP_EOL;
			return true;
		} else {
			echo 'Login is a failure.', PHP_EOL;
		}
		return false;
	}

	protected function getHeaders(){

		return [
			'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding:gzip, deflate',
			'Accept-Language:en,zh-CN;q=0.8,zh;q=0.6,pt;q=0.4',
			'Cache-Control:max-age=0',
			'Connection:keep-alive',
			//'Content-Length:94',
			'Content-Type:application/x-www-form-urlencoded',
			'Host:user.ogame.cn',
			'Origin:http://user.ogame.cn',
			'RA-Sid:CA6888E2-20150601-025942-2917f9-494883',
			'RA-Ver:3.0.7',
			'Referer:http://user.ogame.cn/userframe.php',
			'User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36',
		];
	}


}