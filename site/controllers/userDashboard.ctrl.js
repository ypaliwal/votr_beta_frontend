(function() {
	'use strict';

	angular
		.module('myApp')
		.controller('UserDashboard', UserDashboard);

	function UserDashboard($http, $state, DataSrv) {
		var dashVm = this;

		// Public functions
		dashVm.logout = logout;
		dashVm.storeBillNames = storeBillNames;
		// dashVm.getBills = getBills;

		// Public Data
		dashVm.API_BASE = 'http://api.openparliament.ca';


		// Get user data from LocalStorage
		dashVm.userFirstname = localStorage.getItem("userFirstname");
		dashVm.userLastname = localStorage.getItem("userLastname");
		dashVm.userID = localStorage.getItem("user_id");


		// Set login status to LS
		dashVm.loginStatus = localStorage.getItem("userLoginStatus");

		// Check if logged in, if not, send user back to landing page
		if (!dashVm.loginStatus) {
			console.log("Not Logged in!");
			$state.go('landing');
		}

		// Grab top 20 bills
		$http({
			method: 'GET',
			url: dashVm.API_BASE + '/bills/?session=42-1&format=json'
		}).then(function(res) {
			// console.log(res.data.objects);
			DataSrv.bills = (res.data.objects);
			storeBillNames();
		}, function(err) {console.log(err)});


		function storeBillNames() {
			// console.log(DataSrv.bills[0]);

			for(var i = 0; i < DataSrv.bills.length; i++) {
				DataSrv.billsNumbers.push(DataSrv.bills[i].number);
				DataSrv.billsNames.push(DataSrv.bills[i].name.en);
			}

			// console.log(DataSrv.billsNumbers);
			// console.log(DataSrv.billsNames);

			$.post(
			  'https://apiv2.indico.io/keywords/batch?version=2',
			  JSON.stringify({
			    'api_key': "828ffd92b811bbff7d21476cc289e44a",
			    'data': DataSrv.billsNames
			  })
			).then(function(res) { 
				console.log(JSON.parse(res)); 
			});

		}

		// $.post(
		//   'https://apiv2.indico.io/sentiment/batch',
		//   JSON.stringify({
		//     'api_key': "828ffd92b811bbff7d21476cc289e44a",
		//     'data': dashVm.billsNames
		//   })
		// ).then(function(res) { 
		// 	console.log(JSON.parse(res)); 
		// });









		function logout() {
			localStorage.setItem("userLoginStatus", false);
			localStorage.setItem("userLoginTime", "");
			localStorage.setItem("userFirstname", "");
			localStorage.setItem("userLastname", "");
			localStorage.setItem("user_id", "");

			$state.go('landing');
		}



	}

	
})();

