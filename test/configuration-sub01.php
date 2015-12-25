<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub01.php",
	"links": [
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub02",
			"alias": "sub02-config"
		}
	]
}
