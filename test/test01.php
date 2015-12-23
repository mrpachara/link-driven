<?php
	require_once 'BASE.php';
?>
<!DOCTYPE html>
<html lang="en" xml:lang="en" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<meta charset="UTF-8" />
		<meta http-equiv="Content-Language" content="en_US, th_TH" />
		<title>Test Link Driven</title>

		<script type="application/javascript" src="../../camt/js/lib/bower_components/jquery/dist/jquery.js"></script>
		<script type="application/javascript" src="../../camt/js/lib/bower_components/angular/angular.js"></script>

		<script type="application/javascript" src="../angular-core.js"></script>
		<script type="application/javascript" src="app-sub.js"></script>
		<script type="application/javascript" src="app.js"></script>
		<script type="application/javascript">
		</script>
	</head>
	<body ng-app="app">
		<div ng-controller="TestCase01 as testCase01">
			<button type="button" ng-click="testCase01.send()">Send</button>
			<pre>{{ testCase01|json:true }}</pre>
			<div ng-include="testCase01.service02.templatex('resultTemplate')"></div>
		</div>
	</body>
</html>
