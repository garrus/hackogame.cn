<?php
require 'loader.php';
require 'functions.php';
$config = require 'config.php';
define('AREA', 12);


Game:
$client = new \lib\Client(AREA);
$request = new \request\CurrentPlanetQueue();
try {
	/** @var \models\Queue $queue */
	$queue = $request->execute($client);
} catch (\exception\LoginRequiredException $e) {
	login();
	goto Game;
}


$queue && $queue->dump();


function login()
{
	if (!getAction('Login')->run()) {
		die('登录失败！');
	}

	/** @var \actions\SelectGameArea $action */
	$action = getAction('SelectGameArea', ['area' => AREA]);
	if (!$action->run()) {
		die;
	}
}



