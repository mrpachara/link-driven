<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub02.php",
	"links": [
		{
			"rel": "module/javascript",
			"module-id": "app.js04",
			"href": "<?= BASEPATH ?>js04.js",
			"alias": "js04"
		},
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub.php",
			"alias": "sub-config"
		}
	]
}
