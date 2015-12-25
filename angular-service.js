(function(angular){
	'use strict';

	angular.module('ldrvn.service', ['ldrvn'])
		.config([
			'$ldrvnProvider',
			function($ldrvnProvider){
				var debug_count = 0;
				$ldrvnProvider.appendEngine({
					'module': [
						'$q',
						function($q){
							var $ldrvn = this;

							function ModuleEngine(links){
								Object.defineProperty(this, '$$ldrvn', {
									'value': $ldrvn.create(links),
								});

								this.$$dependenciesHandler = null;
							}

							angular.extend(ModuleEngine.prototype, {
								'ref': function(uri){
									var url = this.$$ldrvn.$url(uri);

									return (url)?
										$ldrvn.loadConfig(url) : ldrv.loadConfig($ldrvn.NONECONFIG)
									;
								},
								'dependencies': function(){
									if(debug_count > 100){
console.warn('infinity');
										return $q.reject([]);
									}
									console.debug('count', ++debug_count);
									if(this.$$dependenciesHandler !== null) return this.$$dependenciesHandler;
console.warn('unknow handler');
									var inst = this;

									var loaders = [];
									var modules = [];

									inst.$$ldrvn.$forLinks(function(link){
										loaders.push($ldrvn.loadConfig(inst.$$ldrvn.$url(link)));
									});

									var handler = $q.all(loaders)
										.then(function(configServices){
											var subDependencies = [];
											angular.forEach(configServices, function(configService){
console.debug('adding:', configService);
												modules.push(configService);
												subDependencies.push(configService.module().dependencies()
													.then(function(subModules){
														angular.forEach(subModules, function(subModule){
console.warn('checking:', subModule.$prop('uri'));
angular.forEach(modules, function(module){
	console.warn('\t', (subModule === module),module.$prop('uri'));
});
															if(modules.indexOf(subModule) < 0){
																modules.push(subModule);
															}
														});
													})
												);
											});

											return $q.all(subDependencies);
										})
										.then(function(){
console.wran('return module:', modules);
											return modules;
										})
									;

									if(inst.$$dependenciesHandler === null) inst.$$dependenciesHandler = handler;

									return inst.$$dependenciesHandler;
								},
							});

							return function(){
								if(angular.isDefined(this.$$module)) return this.$$module;

								return this.$$module = new ModuleEngine(this.$links('module'));
							};
						}
					],
					'layout': [
						function(){
							var $ldrvn = this;

							function LayoutEngine(links){
								Object.defineProperty(this, '$$ldrvn', {
									'value': $ldrvn.create(links),
								});
							}

							angular.extend(LayoutEngine.prototype, {
								'url': function(uri){
									return this.$$ldrvn.$url(uri);
								}
							});

							return function(){
								if(angular.isDefined(this.$$layout)) return this.$$layout;

								return this.$$layout = new LayoutEngine(this.$links('layout'));
							};

						}
					],
				});
			}
		])

		.run([
			function(){

			}
		])

		.provider('moduleService', [
			function(){
				var localProvider = {
					'uri': undefined,
				};

				var provider = {
					'configURI': function(uri){
						if(arguments.length === 0) return localProvider.uri;
						localProvider.uri = uri;

						return provider;
					},
					'$get': [
						function(){
							var initialed = true;
							if(angular.isUndefined(localProvider.uri)){
								$log.error('Configuration for module not found!!!');
								initialed = false;
							}

							var local = {
								'url': undefined,
							};

						}
					],
				};

				return provider;
			}
		])

		.provider('layoutService', [
			function(){
				var localProvider = {
					'uri': undefined,
				};

				var provider = {
					'configURI': function(uri){
						if(arguments.length === 0) return localProvider.uri;
						localProvider.uri = uri;

						return provider;
					},
					'$get': [
						'$log', '$ldrvn',
						function($log, $ldrvn){
							var initialed = true;
							if(angular.isUndefined(localProvider.uri)){
								$log.error('Configuration for layout not found!!!');
								initialed = false;
							}

							var local = {
								'url': undefined,
							};

							return $ldrvn.createService($ldrvn.loadConfig((initialed)? localProvider.uri : $ldrvn.NONECONFIG), {
								'url': function(uri){
									if(arguments.length === 0) return local.url;
									local.url = this.$$configService.layout().url(uri);

									return local.url;
								},
							});
						}
					],
				};

				return provider;
			}
		])
	;
})(this.angular);
