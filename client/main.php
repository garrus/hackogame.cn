<?php
require 'loader.php';
require 'functions.php';
$config = require 'config.php';

if (!getAction('Login')->run()) {
	die('登录失败！');
}

/** @var \actions\SelectGameArea $action */
$action = getAction('SelectGameArea');
if (!$action->run()) {
	die;
}
$client = new \lib\Client($action->area);
$request = new \request\CurrentPlanetQueue();
$queue = $request->execute($client);

$queue && $queue->dump();



