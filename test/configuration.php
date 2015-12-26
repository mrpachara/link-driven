<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration.php",
	"links": [
		{
			"rel": "service",
			"href": "<?= BASEPATH ?>data.php",
			"alias": "data"
		},
		{
			"rel": "template",
			"href": "<?= BASEPATH ?>template.html",
			"alias": "resultTemplate"
		},
		{
			"rel": "layout",
			"href": "<?= BASEPATH ?>main-layout.html",
			"alias": "main-layout"
		},
		{
			"rel": "module/javascript",
			"href": "<?= BASEPATH ?>js00.js",
			"alias": "js00"
		},
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub.php",
			"alias": "sub-config"
		}
	]
}
