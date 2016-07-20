<?php
namespace lib;

class Helper {

	/**
	 * @param string $url
	 * @param null $postData
	 * @param array $headers
	 * @return mixed
	 */
	public static function curl($url, $postData=null, $headers=[]){

		$ch = curl_init($url);
		curl_setopt_array($ch, [
			CURLOPT_COOKIEJAR => RUNTIME_PATH. DIRECTORY_SEPARATOR. 'cookie',
			CURLOPT_COOKIEFILE => RUNTIME_PATH. DIRECTORY_SEPARATOR. 'cookie',
			CURLOPT_HEADER => false,
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_HTTPHEADER => $headers,
			CURLOPT_FOLLOWLOCATION => true,
		]);

		if ($postData) {
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($postData) ? $postData : http_build_query($postData));
		}

		$response = curl_exec($ch);
		curl_close($ch);
		return $response;
	}

	/**
	 * @param int|double $number
	 * @return string
	 */
	public static function friendlyNumber($number){
		
		if ($number >= 1000000) {
			return round($number / 1000000, 2). 'M';
		}
		if ($number >= 1000) {
			return round($number / 1000, 2). 'K';
		}
		return (string)$number;
	}

	/**
	 * @param int $duration
	 * @return string
	 */
	public static function friendlyDuration($duration){
		
		$str = '';
		
		if ($duration >= 86400) {
			$str .= (string)ceil($duration / 86400). 'd ';
			$duration = $duration%86400;
		}
		if ($duration >= 3600) {
			$str .= (string)ceil($duration / 3600). 'h ';
			$duration = $duration%3600;
		} else {
			if ($str !== '') {
				$str .= '0h ';
			}
		}
		
		if ($duration >= 60) {
			$str .= (string)ceil($duration / 60). 'm ';
			$duration = $duration%60;
		} else {
			if ($str !== '') {
				$str .= '0m '. $duration;
			}
		}
		
		$str .= ' '. (string)$duration. 's';
		
		return $str;
	}
}