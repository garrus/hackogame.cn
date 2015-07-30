<?php
namespace lib;

class Helper {

	public static function curl($url, $postData=null, $headers=[]){

		$ch = curl_init($url);
		curl_setopt_array($ch, [
			CURLOPT_COOKIEJAR => RUNTIME_PATH. DIRECTORY_SEPARATOR. 'cookie',
			CURLOPT_COOKIEFILE => RUNTIME_PATH. DIRECTORY_SEPARATOR. 'cookie',
			CURLOPT_HEADER => false,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_HTTPHEADER => $headers
		]);

		if ($postData) {
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
		}

		$response = curl_exec($ch);
		curl_close($ch);
		return $response;
	}

}