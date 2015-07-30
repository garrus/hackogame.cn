<?php
namespace lib;


class Object {

	public function __construct(array $config=[]){
		foreach ($config as $key => $val){
			$this->$key = $val;
		}
	}

	/**
	 * @param $key
	 *
	 * @return mixed
	 */
	public function __get($key){
		$getter = 'get'. $key;
		if (method_exists($this, $getter)) {
			return $this->{$getter};
		}
		throw new \RuntimeException('试图读取未定义的属性 '. get_class($this). '.'. $key);
	}

	/**
	 * @param $key
	 * @param $val
	 *
	 * @return mixed
	 */
	public function __set($key, $val){
		$setter = 'set'. $key;
		if (method_exists($this, $setter)) {
			return $this->{$setter}($val);
		}
		throw new \RuntimeException('试图写入未定义的属性 '. get_class($this). '.'. $key);
	}

}