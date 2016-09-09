(function(){
	'use strict';

	angular
		.module('myApp', ['ui.router']);

	angular
		.module('myApp')
		.config(function($stateProvider, $httpProvider, $urlRouterProvider){
			$urlRouterProvider.otherwise('/dashboard');

			$stateProvider
			.state('landing', {
				url: '/',
				templateUrl: 'site/partials/landing.html',
				controller: 'LandingCtrl as ctrl'
			})
			.state('userPortfolio', {
				url: '/portfolio',
				templateUrl: 'site/partials/userPortfolio.html',
				controller: 'UserPortfolio as ctrl'
			})
			.state('userDashboard', {
				url: '/dashboard',
				templateUrl: 'site/partials/userDashboard.html',
				controller: 'UserDashboard as ctrl'
			});
		});

})();