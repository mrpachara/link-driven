(function(angular){
	'use strict';

	angular.module('app', ['ldrvn.service', 'app.sub'])
		.config([
			'$ldrvnProvider', 'configServiceProvider', 'layoutServiceProvider',
			function($ldrvnProvider, configServiceProvider, layoutServiceProvider){
console.info('app config');
				$ldrvnProvider.appendEngine({
					'template': [
						function(){
							return function(uri, data){
								var result = null;

								uri = this.$prepareURI(uri);
								if((uri[0] !== null) && (uri[0].rel === 'template')){
									result = this.$url(uri);
								}

								return result;
							};
						}
					],
				});

				configServiceProvider.configURI('./configuration.php');
			}
		])

		.run([
			'$rootScope', '$ldrvn', 'moduleService', 'layoutService',
			function($rootScope, $ldrvn, moduleService, layoutService){
				$rootScope.layoutService = layoutService;

				$ldrvn.loadConfig('./configuration').then(function(configService){
					configService.module().dependencies().then(function(modules){
console.error('dependencies:', modules);
					});
				}, function(error){
console.error(error);
				});

				layoutService.promise.then(function(service){
					service.url('main-layout');
				});

			}
		])

		.factory('testConfigLoader', [
			'$ldrvn',
			function($ldrvn){
				return $ldrvn.loadConfig('./configuration.php');
			}
		])

		.factory('subTestConfigLoader', [
			'$ldrvn',
			function($ldrvn){
				return $ldrvn.loadConfig('./configuration-sub.php');
			}
		])

		.factory('testService', [
			'$q', '$ldrvn', 'testConfigLoader', 'subTestConfigLoader',
			function($q, $ldrvn, testConfigLoader, subTestConfigLoader){
				return $ldrvn.createService(testConfigLoader, {
					'load': function(){
						var service = this;
console.debug('test01', service, service.$$configService);
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.$load('data');
					},
					'send': function(item){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));
console.debug('send called');
						return service.$$configService.module().ref('sub-config').then(function(configService){
							return configService.$http(['update', item], {'data': item});
						});
					},
					'template': function(href){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return null;

						return service.$$configService.template(href);
					},
				});
			}
		])

		.run([function(){
console.info('app run');
		}])

		.factory('test02Service', [
			'$q', '$ldrvn', 'testConfigLoader', 'subTestConfigLoader',
			function($q, $ldrvn, testConfigLoader, subTestConfigLoader){
				return $ldrvn.createService(testConfigLoader, {
					'templatex': function(href){
						var service = this;
console.debug('test02', service, service.$$configService);
						if(angular.isUndefined(service.$$configService)) return null;

						return service.$$configService.template(href);
					},
				});
			}
		])

		.controller('TestCase01', TestCase01Controller)
	;

	function TestCase01Controller($timeout, testService, test02Service){
		var vm = this;

		vm.service = testService;
		vm.service02 = test02Service;
		vm.model = null;
		vm.result = null;

		$timeout(function(){
			vm.service.promise.then(function(service){
				service.load().then(function(data){
					vm.model = data;
				});
			});
		}, 1000);
	}

	TestCase01Controller.$inject = ['$timeout', 'testService', 'test02Service'];

	angular.extend(TestCase01Controller.prototype, {
		'send': function(){
			var vm = this;
			vm.service.send(angular.extend({'newValue': 'abcdef'}, vm.model.item)).then(function(data){
				vm.result = data;
			});
		},
	});
})(this.angular);
