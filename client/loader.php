<?php

spl_autoload_register(function($className){
	$tokens = explode('\\', $className);
	if (count($tokens) == 1) {
		return false;
	}
	$file = __DIR__. DIRECTORY_SEPARATOR. implode(DIRECTORY_SEPARATOR, $tokens). '.php';
	if (is_file($file)) {
		require $file;
		return true;
	} else {
		return false;
	}
});