(function() {
	'use strict';
	
	angular
		.module('myApp')
		.service('DataSrv', DataSrv);

		function DataSrv($http) {
			var self = this;

			// Public variables
			self.bills = [];
			self.billsNumbers = [];
			self.billsNames = [];
			self.billskeywords = [];



			// Public functions

		}
	
})();