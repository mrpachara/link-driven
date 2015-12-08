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
		}
	]
}
