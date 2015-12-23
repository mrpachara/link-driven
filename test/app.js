(function(angular){
	angular.module('app', ['ldrvn', 'app.sub'])
		.config([
			'ldrvnProvider',
			function(ldrvnProvider){
console.info('app config');
				ldrvnProvider.appendEngine({
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
					'reference': [
						'$q',
						function($q){
							var ldrvn = this;
							return function(uri, serviceHref, config){
								uri = this.$prepareURI(uri);
								if((uri[0] !== null) && (uri[0].rel === 'module')){
									return ldrvn.util.loadConfig(this.$url(uri)).then(function(configService){
										return configService.$http(serviceHref, config);
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
				return ldrvn.util.loadConfig('./configuration.php');
			}
		])

		.factory('subTestConfigLoader', [
			'ldrvn',
			function(ldrvn){
				return ldrvn.util.loadConfig('./configuration-sub.php');
			}
		])

		.factory('testService', [
			'$q', 'ldrvn', 'testConfigLoader', 'subTestConfigLoader',
			function($q, ldrvn, testConfigLoader, subTestConfigLoader){
				return ldrvn.util.createService(testConfigLoader, {
					'load': function(){
						var service = this;
console.debug('test01', service, service.$$configService);
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.$load('data');
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

		.run([function(){
console.info('app run');
		}])

		.factory('test02Service', [
			'$q', 'ldrvn', 'testConfigLoader', 'subTestConfigLoader',
			function($q, ldrvn, testConfigLoader, subTestConfigLoader){
				return ldrvn.util.createService(testConfigLoader, {
					'loadx': function(){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.$load('data');
					},
					'sendx': function(item){
						var service = this;
						if(angular.isUndefined(service.$$configService)) return $q.reject(new Error('Service not ready'));

						return service.$$configService.reference('sub-config', ['update', item], {'data': item});
					},
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
		}, 3000);
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
