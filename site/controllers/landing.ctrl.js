(function() {
	'use strict';

	angular
		.module('myApp')
		.controller('LandingCtrl', LandingCtrl);

	function LandingCtrl($http, $state) {
		var landingVm = this;

		// Public functions
		landingVm.openSignupModal = openSignupModal;
		landingVm.signup = signup;
		landingVm.openLoginModal = openLoginModal;
		landingVm.login = login;

		function openSignupModal() {
			// open the modal
			// MODAL; Click events
			var modal = document.getElementById('myModal');
			var btn = document.getElementById("myBtn");
			var span = document.getElementsByClassName("close")[0];
			modal.style.display = "block";
			span.onclick = function() {
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}
		function signup() {
			var formComplete1 = !(landingVm.signupFirstname == undefined);
			var formComplete2 = !(landingVm.signupLastname == undefined);
			var formComplete3 = !(landingVm.signupEmail == undefined);
			var formComplete4 = !(landingVm.signupPassword == undefined);

			if (formComplete1 && formComplete2 && formComplete3 && formComplete4) {
				landingVm.hashedPasswordSignup = hashCode(landingVm.signupPassword);
				var req = {
					method: 'POST',
					url: 'users/newUser',
					data: { firstname: landingVm.signupFirstname, lastname: landingVm.signupLastname, email: landingVm.signupEmail, passwordHash: landingVm.hashedPasswordSignup }
				}
				$http(req)
				.then(
					function(res){
						console.log(res);
						$state.reload();
					},
					function(err){console.log(err)}
				);
			} else {
				 alert ("SIGNUP FORM: Please fill all the required fields.");
			}
		}

		function openLoginModal() {
			// open the modal
			// MODAL; Click events
			var modal = document.getElementById('myModal_');
			var btn = document.getElementById("myBtn");
			var span = document.getElementsByClassName("close")[1];
			modal.style.display = "block";
			span.onclick = function() {
			    modal.style.display = "none";
			}
			window.onclick = function(event) {
			    if (event.target == modal) {
			        modal.style.display = "none";
			    }
			}
		}
		function login() {
			// check if the specified data is stored in the DB-Users
			// If so, set the LS items as "logged in", "user's name" and "array of stocks"
			landingVm.hashedPasswordLogin = hashCode(landingVm.loginPassword);
			var req = {
				method: 'POST',
				url: 'users/login',
				data: { email: landingVm.loginEmail, passwordHash: landingVm.hashedPasswordLogin }
			}
			$http(req)
			.then(
				function(res){
					var time = new Date();
					// console.log(res.data);
					// capture: USER-DB's _id, name, stockArr
					localStorage.setItem("userLoginStatus", true);
					localStorage.setItem("userLoginTime", time.getTime());
					localStorage.setItem("userFirstname", res.data.firstname);
					localStorage.setItem("userLastname", res.data.lastname);
					localStorage.setItem("user_id", res.data._id);
					// localStorage.setItem("userStockArr", res.data.stockArr);
					// $state.go('myPortfolio');
					$state.go('userDashboard');
				}, 
				function(err) { console.log(err) }
			)
		}
		


		// Function to create hash code for passwords
		function hashCode(val){
			var hash = 0;
			if (val.length == 0) return hash;
			for (var i = 0; i < val.length; i++) {
				var char = val.charCodeAt(i);
				hash = ((hash<<5) - hash) + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		}


	}

	
})();

