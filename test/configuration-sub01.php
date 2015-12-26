<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub01.php",
	"links": [
		{
			"rel": "module/javascript",
			"href": "<?= BASEPATH ?>js02.js",
			"alias": "js03"
		},
		{
			"rel": "module/javascript",
			"href": "<?= BASEPATH ?>js03.js",
			"alias": "js03"
		},
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub02.php",
			"alias": "sub02-config"
		}
	]
}
