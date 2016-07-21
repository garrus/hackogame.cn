<?php
require 'loader.php';
require 'functions.php';
$config = require 'config.php';
define('AREA', 12);

$client = new \lib\Client(AREA);
$request = new \request\CurrentPlanetQueue();
/** @var \models\Queue $queue */
$queue = $request->execute($client);

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



