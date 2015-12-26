<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub.php",
	"links": [
		{
			"rel": "service",
			"method": "put",
			"href": "<?= BASEPATH ?>data.php/{{ id }}",
			"alias": "update"
		},
		{
			"rel": "module/javascript",
			"href": "<?= BASEPATH ?>js01.js",
			"alias": "js01"
		},
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub01.php",
			"alias": "sub01-config"
		},
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub02.php",
			"alias": "sub02-config"
		}
	]
}
