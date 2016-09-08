(function() {
	'use strict';

	angular
		.module('myApp')
		.controller('UserPortfolio', UserPortfolio);

	function UserPortfolio($http, $state, DataSrv) {
		var userPortVm = this;

		// Public functions 
		userPortVm.openAddStockModal = openAddStockModal;
		userPortVm.addStock = addStock;
		userPortVm.populateQuandl = populateQuandl;
		userPortVm.updateStock = updateStock;
		userPortVm.updateStockAct = updateStockAct;
		userPortVm.makeChart = makeChart;
		userPortVm.logout = logout;


		// Get user data from LocalStorage
		userPortVm.userFirstname = localStorage.getItem("userFirstname");
		userPortVm.userLastname = localStorage.getItem("userLastname");
		userPortVm.userID = localStorage.getItem("user_id");
		userPortVm.deleteStock = deleteStock;
		userPortVm.showPortfolio = undefined;
		userPortVm.chartLoaded = false;
		userPortVm.protfolioTotal = 0;
		userPortVm.totalBookValue = 0;
		userPortVm.textToggle1 = false;

		// load the stock data
			// promise: store the 
		// load the 

		userPortVm.loginStatus = localStorage.getItem("userLoginStatus");

		if (!userPortVm.loginStatus) {
			console.log("Not Logged in!");
			$state.go('landing');
		}

		$http.get('stockByName/' + userPortVm.userID)
		.then(function(res){
			populate(res.data);
			console.log(res.data);
			if(res.data.length == 0) {
				userPortVm.textToggle1 = true;
			}
		}, function(err){console.log(err)});
		function populate(arr) {
			userPortVm.dataArr = arr;
			console.log(userPortVm.dataArr);
			setTimeout(function(){ 
				// console.log(portVm.dataArr);
				var arrLen = arr.length - 1;
				console.log("test 1");
				populateQuandl(arrLen, userPortVm.dataArr);
			}, 150);
		}




		// If recieved stock arr's length is 0, hide progress bar
		// display message to add stocks

		// POPULATE RELEVANT STOCK DATA FROM QUANDL
		function populateQuandl(count, arr) {
			if(count >= 0) {
				console.log("populateQuandl running");
				var tickerUrl = arr[count].ticker;
				$http({
					method: 'GET',
					url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + tickerUrl + '.json?api_key=rh1C19BLzxoz3PZs7HB6',
				}).then(function(res) {

					if (res.data.dataset.name.split('(')[0] != undefined) {
						var thisArr = count;

						arr[thisArr].name = res.data.dataset.name.split('(')[0]; // Company name

						if (count == 0) {
							console.log("Count is: ");
							console.log(arr[0].name);
							userPortVm.showPortfolio = arr[0].name;
							// makeChart(arr[0].ticker);
						}
						
						
						StockSrv.stockTables[tickerUrl + '_compName'] = res.data.dataset.name.split('(')[0];
						arr[thisArr].currPrice = res.data.dataset.data[0][4]; // Price for today
						console.log(res.data.dataset.data[0]);
						arr[thisArr].marketPrice = arr[thisArr].currPrice * arr[thisArr].quantity;
						arr[thisArr].percentageChange = (((arr[thisArr].currPrice - arr[thisArr].purchasePrice)/arr[thisArr].purchasePrice)*100);
						arr[thisArr].bookValue = arr[thisArr].purchasePrice * arr[thisArr].quantity;
						userPortVm.protfolioTotal += arr[thisArr].marketPrice;
						userPortVm.totalBookValue += arr[thisArr].bookValue;
						// StockSrv.stockTables[tickerUrl + '_compName'] = arr[thisArr].name;

						if(!(tickerUrl in StockSrv.stockTables)) {
							var closeValues = [];
							var closeDates = [];

							for(var i = 0; i < 22; i++) {
								closeValues.push(res.data.dataset.data[i][4]);
								closeDates.push(res.data.dataset.data[i][0]);
							}

							// for(var i = 0; i < ){}
							// StockSrv.tickerUrl
							StockSrv[tickerUrl + '_dates'] = closeDates;
							StockSrv[tickerUrl + '_values'] = closeValues;
						}

						if(!userPortVm.chartLoaded) {
							makeChart(tickerUrl);
							userPortVm.chartLoaded = true;
						}
					}
					// if(!portVm.chartLoaded) {
					// 	makeChart(tickerUrl);
					// }

					// console.log(StockSrv['GOOG_values']);
					// console.log(StockSrv.stockTables['GOOG_compName']);
				}, function(err) { console.log(err) });
				
				populateQuandl(count - 1, arr);	
			} else {
				return 0;
			}
		}		

		function openAddStockModal() {
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
		function addStock() {
			var req = {
				method: 'POST',
				url: "newStock",
				data: { ticker: userPortVm.addStockTicker, purchasePrice: userPortVm.addStockPurchasePrice, quantity: userPortVm.addStockQuantity,  ownerId: userPortVm.userID }
			}
			$http(req)
			.then(
				function(res){
					// console.log(res);
					console.log(res.data._id);

					setTimeout(function() {
						$state.reload();
					}, 100);
				},
				function(err){console.log(err)}
			);
		}

		// STOCK DELETE VIA BUTTON
		function deleteStock(id) {
			$http.delete("stock/" + id)
			.then(function(res) {
				console.log(res);
				setTimeout(function() {
					$state.reload();
				}, 100);
			}, function(err){console.log(err)});
		}

		// STOCK UPDATE VIA BUTTON
		function updateStock(id) {
			$http.get("stock/" + id)
			.then(function(res){
				userPortVm.updateStockData = res.data;
				openModalwData(userPortVm.updateStockData);
			}, function(err) {console.log(err)});
		}
		function openModalwData(data) {
			console.log(data);

			// open the modal
			// MODAL; Click events
			var modal = document.getElementById('myModal_update');
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

			// attach the ng-models to the input forms and the data rec'd
			userPortVm.modalId = data._id;
			userPortVm.modalTicker = data.ticker;
			userPortVm.modalPurchasePrice = data.purchasePrice;
			userPortVm.modalQuantity = data.quantity;
		}
		function updateStockAct() {
			userPortVm.putData = {
				ticker: userPortVm.modalTicker,
				purchasePrice: userPortVm.modalPurchasePrice,
				quantity: userPortVm.modalQuantity
			};
			$http.put('stock/' + userPortVm.modalId, userPortVm.putData)
			.then(function (res) {
				console.log(res);
				$state.reload();
			}, function (err) {
				console.log(err);
			});
		}

		function makeChart(tickerInput) {

			userPortVm.config.data.labels = StockSrv[tickerInput + '_dates'];				

			$("#canvas").remove();
			$("#canvas-wrapper").append('<canvas id="canvas"></canvas>');
			
			// for(var i = 0; i < 2; i++){
			// 	if (portVm.chartLoadArr[i] != undefined){
			// 		var ticker = portVm.chartLoadArr[i];

					userPortVm.config.data.datasets[0].data = StockSrv[tickerInput + '_values'];
					userPortVm.config.data.datasets[0].label = tickerInput;

					userPortVm.config.data.datasets[0].backgroundColor = 'rgba(38, 166, 154, 0.6)';
					userPortVm.config.data.datasets[0].pointBorderColor = 'rgba(235,235,235, 1)';
			// 	}
			// }
			// create the chart
			var ctx = document.getElementById("canvas").getContext("2d");
			window.myLine = new Chart(ctx, userPortVm.config);

			// userPortVm.chartTitle = ("Stock Chart for " + StockSrv.stockTables[portVm.chartLoadArr[0] + '_compName']);
			// if(portVm.chartLoadArr[1] != undefined) {
			userPortVm.chartTitle = ("Stock Chart for " + StockSrv.stockTables[tickerInput + '_compName']);
			// }
		}


		function logout() {
			localStorage.setItem("userLoginStatus", false);
			localStorage.setItem("userLoginTime", "");
			localStorage.setItem("userFirstname", "");
			localStorage.setItem("userLastname", "");
			localStorage.setItem("user_id", "");

			$state.go('landing');
		}

		userPortVm.config = {
			type: 'line',
			data: {
				labels: [], // EXAMPLE: labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
				datasets: [{
					label: "My First dataset", // EXAMPLE: label: "My First dataset",
					data: [] // EXAMPLE: data: [10, 12, 33, 41, 55, 40, 22, 21],
				}
				// ,{
				// 	label: "Select another Stock", // EXAMPLE: label: "My First dataset",
				// 	data: [] // EXAMPLE: data: [10, 12, 33, 41, 55, 40, 22, 21],
				// }
				]
			},
			options: {

				responsive: true,
	            
				tooltips: {
					mode: 'label',
				},
				hover: {
					mode: 'label'
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						// stacked: true,
						scaleLabel: {
							display: true,
							labelString: 'Price (USD)'
						}, 
						// scaleStartValue: 10
						// ticks: {
						// 	suggestedMin: 10,
						// }
					}]
				}
			}
		};

	}

})();