<?php

/**
 * @param $actionName
 * @param array $args
 *
 * @return \lib\BaseAction
 */
function getAction($actionName, array $args=[]){
	global $config;

	$actionClass = '\\actions\\'. ucfirst($actionName);
	if (class_exists($actionClass)) {
		$params = @$config['actions'][$actionName] ?: [];
		$params = array_merge($params, $args);
		return new $actionClass($params);
	} else {
		throw new RuntimeException('找不到动作 '. $actionName);
	}
}