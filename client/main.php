<?php
require 'loader.php';
require 'functions.php';

$config = require 'config.php';


if (!getAction('Login')->run()) {
	die('登录失败！');
}

echo '登录成功！';
getAction('DisplayMyPlanet')->run();

