<?php

namespace lib;


use exception\LoginRequiredException;
use models\Queue;

class Client extends Object
{
    const SERVER_URL = 'http://s{area}.ogame.cn/server.php';

    public $server;

    /**
     * Client constructor.
     * @param int $area
     */
    public function __construct($area)
    {
        parent::__construct([
            'server' => str_replace('{area}', $area, self::SERVER_URL),
        ]);
    }

    /**
     * @param array $params
     * @return array
     */
    public function execute(array $params)
    {
        list($code, $body, $header) = Helper::curl($this->server, $params);
        return json_decode($body, true);
    }

    /**
     * @param BaseRequest $request
     * @return bool|Object
     */
    public function send(BaseRequest $request)
    {

        $data = $this->execute($request->getParams());

        foreach ($data as $object) {
            if ($object['error']) {
                if ($object['error'] == 11001) {
                    throw new LoginRequiredException;
                }
                echo 'Request failure! '. PHP_EOL;
                echo 'Request: '. get_class($request), PHP_EOL;
                echo 'Params: '. print_r($request->getParams(), true), PHP_EOL;
                echo 'Result: '. print_r($data, true). PHP_EOL;
                return false;
            }
            switch ($object['mod']) {
                case $request->getMod():
                    return $request->buildResult($object['msg']);
                case 'symbol':
                    break;
                case 'queue':
                    $this->handleQueue(new Queue($object['msg']));
                    break;
                default:
                    break;
            }
        }
        
        return true;
    }

    /**
     * @param Queue $queue
     */
    protected function handleQueue(Queue $queue){
        
    }

}