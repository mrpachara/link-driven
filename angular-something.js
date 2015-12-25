(function(angular){
	'use strict';

	function ModuleInstance(modules){
		Object.defineProperty(this, '$$modules', {
			'value': modules,
		});
	}

	angular.module('ldrvn.service', ['ldrvn'])
		.config([
			'ldrvnProvider',
			function(ldrvnProvider){
				angular.extend(ModuleInstance.prototype, {

				});

				ldrvnProvider.attachEngine({
					'module': [
						function(){
							return function(){
								if(angular.isDefined(this.$$module))) return this.$$module;

								return this.$$module = new ModuleInstance(this.$links('module'));
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
	;
})(this.angular);
