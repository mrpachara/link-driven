(function(GLOBALOBJECT, angular){
	'use strict';

	angular.module('app.bootstrap', ['ng', 'ldrvn', 'ldrvn.service'])
		.config([
			'configServiceProvider',
			function(configServiceProvider){
				configServiceProvider.configURI('./configuration');
			}
		])
	;

	angular.injector(['app.bootstrap'], true).invoke([
		'$document', 'moduleService',
		function($document, moduleService){
			moduleService.appendScripts().then(
				function(moduleIds){
					console.debug(moduleIds);
					var document = $document[0];
					angular.element(document).ready(function(){
						angular.bootstrap(document, moduleIds, {strictDi: true});
					});
				},
				function(error){
					console.error(error);
				}
			);
		}
	], GLOBALOBJECT);
})(this, this.angular);
