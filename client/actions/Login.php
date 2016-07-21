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
		list($code, $body, $header) = Helper::curl(self::LOGIN_URL, [
			'passport' => $this->username,
			'password' => $this->password,
			'loginsubmit' => ' 登录 ',
			'cookietime' => '315360000',
			'inform' => '1',
		]);
		logHtml("$header\r\n\r\n$body", 'login.bin');
		
		if ($code === 302) {
			$location = Helper::parseHttpHeader($header, 'Location');
			list($code, $body, $header) = Helper::curl($location);
			if ($code == 200 && strpos($body, 'alert') === false) {
				echo 'Login is a success!', PHP_EOL;
				return true;
			}
		}
		
		echo 'Login is a failure.', PHP_EOL;
		return false;
	}

}