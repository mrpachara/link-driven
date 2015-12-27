(function(GLOBALOBJECT, angular){
	'use strict';

	var MODULE_ID = 'js03';

	angular.module('app.' + MODULE_ID, [])
		.config([
			function(){
console.log(MODULE_ID + ' config');
			}
		])

		.run([
			function(){
console.log(MODULE_ID + ' run');
			}
		])

	;
})(this, this.angular);
