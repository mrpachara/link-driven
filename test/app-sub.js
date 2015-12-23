(function(angular){
	'use strict';

	angular.module('app.sub', [])
		.config([function(){
			console.info('sub config');
		}])

		.run([function(){
			console.info('sub run');
		}])
	;
})(this.angular);
