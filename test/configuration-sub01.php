<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub01.php",
	"links": [
		{
			"rel": "module/javascript",
			"module-id": "app.js02",
			"href": "<?= BASEPATH ?>js02.js",
			"alias": "js03"
		},
		{
			"rel": "module/javascript",
			"module-id": "app.js03",
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
