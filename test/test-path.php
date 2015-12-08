<?php
	require_once 'BASE.php';

	header("Content-Type: text/plain; charset=utf-8");

	echo BASEPATH."xxx/yyy/zzzz".PHP_EOL;
	echo __DIR__.PHP_EOL;
	var_dump($_SERVER);
?>
