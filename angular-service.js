(function(angular){
	'use strict';

	angular.module('ldrvn.service', ['ldrvn'])
		.config([
			'$ldrvnProvider',
			function($ldrvnProvider){
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
									if(this.$$dependenciesHandler !== null) return this.$$dependenciesHandler;

									var inst = this;

									var modules = [];
									var exceptUrls = [];

									function dependenciesFn(configService){
										if(configService.$$config) modules.push(configService);
										var loaders = [];
										configService.module().$$ldrvn.$forLinks(function(link){
											var url = configService.module().$$ldrvn.$url(link);
											if(exceptUrls.indexOf(url) < 0){
												exceptUrls.push(url);
												loaders.push($ldrvn.loadConfig(url).then(dependenciesFn));
											}
										});

										return $q.all(loaders).then(function(){
											return modules;
										});
									}

									if(inst.$$dependenciesHandler === null)
										inst.$$dependenciesHandler = dependenciesFn({
											'module': function(){
												return inst;
											},
										})
									;

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
