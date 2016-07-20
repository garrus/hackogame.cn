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

/**
 * @param string $content
 * @param string $name
 */
function logHtml($content, $name){
	
	file_put_contents(RUNTIME_PATH. DIRECTORY_SEPARATOR. 'html'. DIRECTORY_SEPARATOR. $name, $content);
}