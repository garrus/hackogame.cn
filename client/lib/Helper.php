<?php
namespace lib;

class Helper
{

    protected static $headers = [
        'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding:gzip, deflate',
        'Accept-Language:en,zh-CN;q=0.8,zh;q=0.6,pt;q=0.4',
        'Cache-Control:max-age=0',
        'Connection:keep-alive',
        //'Content-Length:94',
        'Content-Type:application/x-www-form-urlencoded',
        //'Host:user.ogame.cn',
        //'Origin:http://user.ogame.cn',
        'RA-Sid:CA6888E2-20150601-025942-2917f9-494883',
        'RA-Ver:3.0.7',
        'Referer:http://user.ogame.cn/userframe.php',
        'User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36',
    ];

    /**
     * @param string $url
     * @param null $postData
     * @param array $headers
     * @return array [statusCode_int, body_string, header_string]
     */
    public static function curl($url, $postData = null, $headers = [])
    {

        echo ' >> curl ' . ($postData ? '[POST] ' : '[GET] ') . $url, ' ... ';
        usleep(200000);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_COOKIEJAR => RUNTIME_PATH . DIRECTORY_SEPARATOR . 'cookie',
            CURLOPT_COOKIEFILE => RUNTIME_PATH . DIRECTORY_SEPARATOR . 'cookie',
            CURLOPT_HEADER => true,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_HTTPHEADER => array_merge($headers, static::$headers),
            CURLOPT_FOLLOWLOCATION => false,
        ]);

        if ($postData) {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($postData) ? $postData : http_build_query($postData));
        }

        $response = curl_exec($ch);
        $tokens = explode("\r\n\r\n", $response, 2);
        if (count($tokens) == 1) {
            $header = $tokens[0];
            $body = '';
        } else {
            list($header, $body) = $tokens;
        }

        if (strpos($header, 'Content-Encoding: gzip') !== false) {
            $body = gzdecode($body);
        }

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        echo $statusCode, PHP_EOL;
        curl_close($ch);

        return [$statusCode, $body, $header];
    }

    /**
     * @param string $headerStr
     * @param string $name
     * @return string
     */
    public static function parseHttpHeader($headerStr, $name)
    {
        if (preg_match("/$name: ([^\r\n]+)/", $headerStr, $matches)) {
            return $matches[1];
        }
        return '';
    }

    /**
     * @param int|double $number
     * @return string
     */
    public static function friendlyNumber($number)
    {

        if ($number >= 1000000) {
            return round($number / 1000000, 2) . 'M';
        }
        if ($number >= 1000) {
            return round($number / 1000, 2) . 'K';
        }
        return (string)$number;
    }

    /**
     * @param int $duration
     * @return string
     */
    public static function friendlyDuration($duration)
    {

        $d = $h = $m = $s = null;

        if ($duration >= 86400) {
            $d = ceil($duration / 86400);
            $duration = $duration % 86400;
        }
        if ($duration >= 3600) {
            $h = ceil($duration / 3600);
            $duration = $duration % 3600;
        } elseif ($d !== null) {
            $h = 0;
        }

        if ($duration >= 60) {
            $m = ceil($duration / 60);
            $duration = $duration % 60;
        } elseif ($h !== null) {
            $m = 0;
        }
        $s = $duration;

        if ($d !== null) {
            return sprintf('%dd%dh%dm%ds', $d, $h, $m, $s);
        }
        if ($h !== null) {
            return sprintf('%dh%dm%ds', $h, $m, $s);
        }
        if ($m !== null) {
            return sprintf('%dm%ds', $m, $s);
        }
        return $s. 's';
    }
}