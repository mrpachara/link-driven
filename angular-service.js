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

							function ModuleEngine(){
								$ldrvn.CLASS.apply(this, arguments);

								this.$$dependenciesHandler = null;
							}

							angular.extend($ldrvn.extendLdrvn(ModuleEngine).prototype, {
								'ref': function(uri){
									var url = this.$url(uri);

									return (url)?
										$ldrvn.loadConfig(url) : $ldrv.loadConfig($ldrvn.NONECONFIG)
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
										configService.module().$forLinks(function(link){
											var url = configService.module().$url(link);
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
					'moduleJavascript': [
						'$document', '$q',
						function($document, $q){
							var $ldrvn = this;

							function ModuleJavascriptEngine(){
								$ldrvn.CLASS.apply(this, arguments);

								this.$$scriptsHandler = null;
							}

							angular.extend($ldrvn.extendLdrvn(ModuleJavascriptEngine).prototype, {
								'appendScripts': function(){
									if(this.$$scriptsHandler !== null) return this.$$scriptsHandler;

									var inst = this;
									var loaders = [];
									inst.$forLinks(function(link){
										var url = inst.$url(link);
										var scriptDefer = $q.defer();
										loaders.push(scriptDefer.promise);

										var script = $document[0].createElement('script');
										script.setAttribute('type', 'application/javascript');
										$document.find('head').append(script);
										script.addEventListener('load', function(ev){
											scriptDefer.resolve(script);
										}, false);
										script.setAttribute('src', url);
									});

									return this.$$scriptsHandler = $q.all(loaders);
								},
							});

							return function(){
								if(angular.isDefined(this.$$moduleJavascript)) return this.$$moduleJavascript;

								return this.$$moduleJavascript = new ModuleJavascriptEngine(this.$links('module/javascript'));
							};
						}
					],
					'layout': [
						function(){
							var $ldrvn = this;

							function LayoutEngine(){
								$ldrvn.CLASS.apply(this, arguments);
							}

							angular.extend($ldrvn.extendLdrvn(LayoutEngine).prototype, {
								'url': function(uri){
									return this.$url(uri);
								},
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

		.provider('configService', [
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
					'$get': function(){
						return {};
					},
				};

				return provider;
			}
		])

		.provider('moduleService', [
			'configServiceProvider',
			function(configServiceProvider){
				var localProvider = {
					'uri': undefined,
				};

				var provider = {
					'$get': [
						'$q', '$ldrvn',
						function($q, $ldrvn){
							var initialed = true;
							var configURI = configServiceProvider.configURI();

							if(angular.isUndefined(configURI)){
								$log.error('Configuration for module not found!!!');
								initialed = false;
							}

							var local = {
								'scriptsHandler': null,
							};

							return $ldrvn.createService($ldrvn.loadConfig((initialed)? configURI : $ldrvn.NONECONFIG), {
								'appendScripts': function(){
									return this.promise.then(function(service){
										return service.$$configService.module().dependencies().then(function(configServices){
											configServices.unshift(service.$$configService);
											var handlers = [];
											angular.forEach(configServices.reverse(), function(configService){
												handlers.push(configService.moduleJavascript().appendScripts());
											});

											return $q.all(handlers).then(function(moduleScripts){
												var allScripts = [];
												angular.forEach(moduleScripts, function(scripts){
													allScripts = allScripts.concat(scripts);
												});

												return allScripts;
											});
										});
									});
								},
							});
						}
					],
				};

				return provider;
			}
		])

		.provider('layoutService', [
			'configServiceProvider',
			function(configServiceProvider){
				var localProvider = {
					'uri': undefined,
				};

				var provider = {
					'$get': [
						'$log', '$ldrvn',
						function($log, $ldrvn){
							var initialed = true;
							var configURI = configServiceProvider.configURI();

							if(angular.isUndefined(configURI)){
								$log.error('Configuration for layout not found!!!');
								initialed = false;
							}

							var local = {
								'url': undefined,
							};

							return $ldrvn.createService($ldrvn.loadConfig((initialed)? configURI : $ldrvn.NONECONFIG), {
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
