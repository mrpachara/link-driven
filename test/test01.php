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
		<script type="application/javascript">
(function(angular){
	angular.module('app', ['ldrvn'])
		.config([
			'ldrvnProvider',
			function(ldrvnProvider){
				ldrvnProvider.appendEngine({
					'template': [
						function(){
							return function(uri, data){
								var result = null;

								uri = this.prepareURI(uri);
								if((uri[0] !== null) && (uri[0].rel === 'template')){
									result = this.url(uri);
								}

								return result;
							};
						}
					],
					'reference': [
						'$q',
						function($q){
							var ldrvn = this;
							return function(uri, serviceHref, config){
								uri = this.prepareURI(uri);
								if((uri[0] !== null) && (uri[0].rel === 'module')){
									return ldrvn.util.loadConfig(this.url(uri)).then(function(configService){
										return configService.http(serviceHref, config);
									});
								}

								return $q.reject(new Error('Service is not ready'));
							};
						}
					],
				});
			}
		])

		.factory('testConfigLoader', [
			'ldrvn',
			function(ldrvn){
				return ldrvn.util.loadConfig('<?= BASEPATH ?>configuration.php');
			}
		])

		.factory('subTestConfigLoader', [
			'ldrvn',
			function(ldrvn){
				return ldrvn.util.loadConfig('<?= BASEPATH ?>configuration-sub.php');
			}
		])

		.factory('testService', [
			'$q', 'ldrvn', 'testConfigLoader', 'subTestConfigLoader',
			function($q, ldrvn, testConfigLoader, subTestConfigLoader){
				return ldrvn.util.createService(testConfigLoader, {
					'load': function(){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.load('data');
					},
					'send': function(item){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.reference('sub-config', ['update', item], {'data': item});
					},
					'template': function(href){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return null;

						return service.$$configService.template(href);
					},
				});
			}
		])

		.controller('TestCase01', TestCase01Controller)
	;

	function TestCase01Controller($timeout, testService){
		var vm = this;

		vm.service = testService;
		vm.model = null;
		vm.result = null;

		$timeout(function(){
			vm.service.promise.then(function(service){
				service.load().then(function(data){
					vm.model = data;
				});
			});
		}, 3000);
	}

	TestCase01Controller.$inject = ['$timeout', 'testService'];

	angular.extend(TestCase01Controller.prototype, {
		'send': function(){
			var vm = this;
			vm.service.send(angular.extend({'newValue': 'abcdef'}, vm.model.item)).then(function(data){
				vm.result = data;
			});
		},
	});
})(this.angular);
		</script>
	</head>
	<body ng-app="app">
		<div ng-controller="TestCase01 as testCase01">
			<button type="button" ng-click="testCase01.send()">Send</button>
			<pre>{{ testCase01|json:true }}</pre>
			<div ng-include="testCase01.service.template('resultTemplate')"></div>
		</div>
	</body>
</html>
