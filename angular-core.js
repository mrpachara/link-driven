(function(GLOBALOBJECT, angular){
	'use strict';

	var urlSolver = (function(){
		var aTag = angular.element('<a></a>');

		return function UrlSolver(url){
			aTag.attr('href', url);
			return decodeURI(aTag.prop('href'));
		};
	})();

	function LinkDrivenPrototype(links){
		if(angular.isFunction(links)){
			Object.defineProperty(this, '$$links', {
				'get': links,
			});
		} else{
			Object.defineProperty(this, '$$links', {
				'value': links,
			});
		}
		angular.forEach(links, function(link){
			LinkDrivenPrototype.init(link);
		});
	}
	function LinkDriven(){
		LinkDrivenPrototype.apply(this, arguments);
	}

	function ServicesPrototype(){}
	function Services(){
		ServicesPrototype.apply(this, arguments);
	}

	LinkDriven.prototype = Object.create(LinkDrivenPrototype.prototype);
	LinkDriven.prototype.constructor = LinkDriven;
	Services.prototype = Object.create(ServicesPrototype.prototype);
	Services.prototype.constructor = Services;

	angular.module('ldrvn', [])
		.provider('$ldrvn', [
			function(){
				var localProvider = {
					'engines': {},
					'services': {},
				};

				var provider = {
					'appendEngine': function(engines){
						angular.extend(localProvider.engines, engines);

						return provider;
					},
					'appendService': function(services){
						angular.extend(localProvider.services, services);

						return provider;
					},
					'$get': [
						'$cacheFactory', '$http', '$interpolate', '$q', '$log', '$injector',
						function($cacheFactory, $http, $interpolate, $q, $log, $injector){
							angular.extend(LinkDrivenPrototype, {
								'init': function(link){
									if(angular.isDefined(link.$$interpolate)) return link;

									if(angular.isDefined(link.href)) link.href = urlSolver(link.href);
									//if(angular.isDefined(link.pattern)) link.pattern = urlSolver(link.pattern);
									Object.defineProperty(link, '$$interpolate', {
										//'value': $interpolate((angular.isDefined(link.pattern))? link.pattern : link.href),
										'value': $interpolate((angular.isDefined(link.href))? link.href : ''),
									});

									return link;
								},
							});

							angular.extend(LinkDrivenPrototype.prototype, {
								'$link': function(href){
									for(var i = 0; i < this.$$links.length; i++){
										var link = this.$$links[i];
										if((link.alias === href) || (link.href === href)) return LinkDrivenPrototype.init(link);
									}

									return null;
								},
								'$links': function(rel){
									if(arguments.length === 0) return this.$$links;

									var links = [];
									for(var i = 0; i < this.$$links.length; i++){
										var link = this.$$links[i];
										if(link.rel === rel) links.push(LinkDrivenPrototype.init(link));
									}

									return links;
								},
								'$forLinks': function(rel, fn){
									if(arguments.length === 1){
										fn = rel;
										rel = undefined;
									}

									var links = (rel)? this.$links(rel) : this.$$links;
									angular.forEach(links, fn);
								},
								'$prepareURI': function(uri){
									if(angular.isString(uri)){
										uri = [uri, {}];
									} else if(uri.$$interpolate){
										uri = [uri, {}];
									} else{
										uri = uri.slice(0);
									}

									if(angular.isUndefined(uri[0].$$interpolate)) uri[0] = this.$link(uri[0]);

									return uri;
								},
								'$url': function(uri){
									uri = this.$prepareURI(uri);
									return (uri[0] === null)? null : uri[0].$$interpolate(uri[1]);
								},
								'$http': function(uri, config){
									config = config || {};
									uri = this.$prepareURI(uri);

									var extend = {'url': this.$url(uri)};
									if(angular.isDefined(uri[0].method)) extend.method = uri[0].method;

									return $http(angular.extend(config, extend)).then(
										function(response){
											return response.data;
										},
										function(response){
											return $q.reject(response.data);
										}
									);
								},
								'$load': function(uri, config){
									config = config || {};

									return this.$http(uri, config);
								},
								'$send': function(uri, data, config){
									config = config || {};

									angular.extend(config, {'data': data, 'method': 'post'});
									return this.$http(uri, config);
								},
							});

							function Config(config){
								if(angular.isUndefined(config.links)) config.links = [];
								LinkDriven.call(this, config.links);
								Object.defineProperty(this, '$$config', {
									'value': config,
								});
							}

							angular.extend(Config, {
								'cache': $cacheFactory('config-cache'),
							});

							Config.prototype = Object.create(LinkDriven.prototype);
							Config.prototype.constructor = Config;
							angular.extend(Config.prototype, {
								'$prop': function(name){
									return this.$$config[name];
								},
							});

							var local = {
								'configLoaders': {},
							};

							var $ldrvn = {
								'create': function(links){
									return new LinkDriven(links);
								},
								'extendLdrvn': function(fn){
									if(!angular.isFunction(fn)){
										$log.error('Giving parameter is not a function!!!');
										return;
									}

									var tmpPrototype = fn.prototype;
									fn.prototype = Object.create(LinkDriven.prototype);
									fn.prototype.constructor = fn;
									angular.extend(fn.prototype, tmpPrototype);

									return fn;
								},
								'loadConfig': function(url){
									if(angular.isObject(url)){
										if(angular.isFunction(url.catch)){
											return url;
										} else{
											return $q(function(resolve){
												if(url instanceof Config){
													return resolve(url);
												} else{
													return resolve(new Config(url));
												}
											});
										}
									}

									url = urlSolver(url);

									if(angular.isDefined(local.configLoaders[url])) return local.configLoaders[url];

									return (local.configLoaders[url] = $http.get(url, {'cache': Config.cache})
										.then(
											function(response){
												return new Config(response.data);
											},
											function(error){
												$log.error(error);
												return $ldrvn.NONECONFIG;
											}
									));
								},
								'createService': function(config, description){
									var service = Object.create(angular.extend(new Services(), description));

									Object.defineProperty(service, 'promise', {
										'value': $ldrvn.loadConfig(config).then(function(configService){
											Object.defineProperty(service, '$$configService', {
												'value': configService,
											});

											return service;
										}),
									});

									return service;
								},
							};

							Object.defineProperty($ldrvn, 'NONECONFIG', {
								'value': new Config({}),
							});

							Object.defineProperty($ldrvn, 'CLASS', {
								'value': LinkDriven,
							});

							angular.forEach(localProvider.engines, function(engine, name){
								LinkDriven.prototype[name] = $injector.invoke(engine, GLOBALOBJECT, {'$ldrvn': $ldrvn});
							});

							angular.forEach(localProvider.services, function(service, name){
								Services.prototype[name] = $injector.invoke(service, GLOBALOBJECT, {'$ldrvn': $ldrvn});
							});

							return $ldrvn;
						}
					],
				};

				return provider;
			}
		])
	;
})(this, this.angular);
