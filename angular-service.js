(function(angular){
	'use strict';

	angular.module('ldrvn.service', ['ldrvn'])
		.config([
			'$ldrvnProvider',
			function($ldrvnProvider){
				$ldrvnProvider.appendEngine({
					'module': [
						'$q', '$ldrvn',
						function($q, $ldrvn){
							function ModuleEngine(){
								$ldrvn.CLASS.apply(this, arguments);

								this.$$dependenciesHandler = null;
							}

							angular.extend($ldrvn.extendLdrvn(ModuleEngine).prototype, {
								'ref': function(uri){
									return $ldrvn.loadConfig(this.$url(uri));
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
						'$document', '$q', '$ldrvn',
						function($document, $q, $ldrvn){
							function ModuleJavascriptEngine(){
								$ldrvn.CLASS.apply(this, arguments);

								this.$$scriptsHandler = null;
							}

							angular.extend($ldrvn.extendLdrvn(ModuleJavascriptEngine).prototype, {
								'appendScripts': function(){
									if(this.$$scriptsHandler !== null) return this.$$scriptsHandler;

									var inst = this;
									var loaders = [];
									var moduleIds = [];
									inst.$forLinks(function(link){
										var url = inst.$url(link);
										var elemHead = $document.find('head');
										moduleIds.push(link['module-id']);
										var scriptHandler;

										var elemExistedScript = elemHead.find('script[type="application/javascript"][data-module-id="' + link['module-id'] + '"]');
										if(elemExistedScript.length === 0){
											var scriptDefer = $q.defer();
											scriptHandler = scriptDefer.promise;
											var script = $document[0].createElement('script');
											script.setAttribute('type', 'application/javascript');
											script.setAttribute('data-module-id', link['module-id']);
											angular.element(script).data('loadHandler', scriptDefer.promise);
											elemHead.append(script);
											script.addEventListener('load', function(ev){
												scriptDefer.resolve(script);
											}, false);
											script.addEventListener('error', function(ev){
												scriptDefer.reject(ev);
											}, false);
											script.setAttribute('src', url);
										} else{
											var existedScriptHandler = elemExistedScript.data('loadHandler');
											if(angular.isDefined(existedScriptHandler)){
												scriptHandler = elemExistedScript.data('loadHandler');
											} else{
												var scriptDefer = $q.defer();
												scriptHandler = scriptDefer.promise;
												scriptDefer.resolve(elemExistedScript[0]);
											}
										}

										loaders.push(scriptHandler);
									});

									return this.$$scriptsHandler = $q.all(loaders).then(function(){
										return moduleIds;
									});
								},
							});

							return function(){
								if(angular.isDefined(this.$$moduleJavascript)) return this.$$moduleJavascript;

								return this.$$moduleJavascript = new ModuleJavascriptEngine(this.$links('module/javascript'));
							};
						}
					],
					'layout': [
						'$ldrvn',
						function($ldrvn){
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
						'$log', '$q', '$ldrvn',
						function($log, $q, $ldrvn){
							var configURI = configServiceProvider.configURI();

							if(angular.isUndefined(configURI)){
								$log.error('Configuration for module not found!!!');
							}

							var local = {
								'scriptsHandler': null,
							};

							return $ldrvn.createService($ldrvn.loadConfig(configURI), {
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
							var configURI = configServiceProvider.configURI();

							if(angular.isUndefined(configURI)){
								$log.error('Configuration for layout not found!!!');
							}

							var local = {
								'url': undefined,
							};

							return $ldrvn.createService($ldrvn.loadConfig(configURI), {
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
