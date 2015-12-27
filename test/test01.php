<?php
	require_once 'BASE.php';
?>
<!DOCTYPE html>
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml" ng-strict-di>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Language" content="en_US, th_TH" />
		<title>Test Link Driven</title>

		<script type="application/javascript" src="../../camt/js/lib/bower_components/jquery/dist/jquery.js"></script>
		<script type="application/javascript" src="../../camt/js/lib/bower_components/angular/angular.js"></script>

		<script type="application/javascript" data-module-id="ldrvn" src="../angular-core.js"></script>
		<script type="application/javascript" data-module-id="ldrvn.service" src="../angular-service.js"></script>

		<script type="application/javascript" src="bootstrap.js"></script>
	</head>
	<body ng-include="layoutService.url()"></body>
</html>
