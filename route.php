<?php

set_time_limit(5);

list($uri,) = explode('?', $_SERVER['REQUEST_URI']);
if ($uri == '/server.php') {
	do_transfer($uri);
} elseif (is_file(__DIR__. $uri)) {
	return false;
} else {
	header('http/1.1 404');
	die;
}

function do_transfer($uri){

	static $hostInfo = 'http://182.254.140.159:80';
	$headers = [];
	foreach (getallheaders() as $name => $value) {
		if (strcasecmp($name, 'referer') == 0) {
			$value = 'http://s11.ogame.cn/proxy.html';
		}
		$headers[] = "$name: $value";
	}

	$url = $hostInfo. $uri;
	//echo 'Doing transfer to '. $url, PHP_EOL;

	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HEADER => true,
		CURLOPT_HTTPHEADER => $headers,
		CURLOPT_TIMEOUT => 5,
	]);
	if (!empty($_POST)) {
		curl_setopt_array($ch, [
			CURLOPT_POSTFIELDS => $_POST,
			CURLOPT_POST => true,
		]);
	}

	$response = curl_exec($ch);

	$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);

	if ($code == 200) {
		list($headers, $body) = explode("\r\n\r\n", $response);
		foreach (explode("\r\n", $headers) as $header) {
			header($header);
		}
		header('Via:hack-proxy');
		echo $body;
	} else {
		header('http/1.1 '. $code);
		echo $response;
	}
}