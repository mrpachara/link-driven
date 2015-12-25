(function(angular){
	'use strict';

	angular.module('ldrvn.service', ['ldrvn'])
		.config([
			'ldrvnProvider',
			function(ldrvnProvider){
				ldrvnProvider.appendEngine({
					'layout': [
						function(){
							return function(uri){
								uri = this.$prepareURI(uri);
								return ((uri[0] !== null) && (uri[0].rel === 'layout'))? this.$url(uri) : undefined;
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
						'$log', 'ldrvn',
						function($log, ldrvn){
							var initialed = true;
							if(angular.isUndefined(localProvider.uri)){
								$log.error('Configuration for layout not found!!!');
								initialed = false;
							}

							var local = {
								'url': undefined,
							};

							return ldrvn.createService(ldrvn.loadConfig((initialed)? localProvider.uri : ldrvn.NONECONFIG), {
								'url': function(uri){
									if(arguments.length === 0) return local.url;
									local.url = this.$$configService.layout(uri);

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
