<?php
	require_once 'BASE.php';

	header("Content-Type: application/json; charset=utf-8");
?>
{
	"uri": "<?= BASEPATH ?>configuration-sub02.php",
	"links": [
		{
			"rel": "module",
			"href": "<?= BASEPATH ?>configuration-sub.php",
			"alias": "sub-config"
		}
	]
}
