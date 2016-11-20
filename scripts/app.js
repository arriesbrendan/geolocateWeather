//Set body offset for footer on page
function setFooterSpace() {
    $("body").css("margin-bottom", ($("footer").height() + "px"));
};

//Weather application
function initWeather() {
	//Set base location variables
	var loader = $(".loader");
	var messageError = $(".error");
	var weatherContainer = $(".weather");
	
	//clear all containers
	weatherContainer.html("");
	messageError.html("");
	
	function geolocateUser() { 
		console.log("start geolocation");	
		//Checks if browser supports geolocation.
		if (!navigator.geolocation){
			messageError.html("<h2>Geolocation is not supported by your browser</h2>").show();
			return;
		}

		//retrieves user GPS and passes it to the getWeather function
		function success(position) {
			var latitude  = position.coords.latitude;
			var longitude = position.coords.longitude;
			console.log("lat:" + latitude);
			console.log("long:" + longitude);
			getWeather(latitude, longitude);
		}  
		
		//returns error if location is unavailible.
		function error() {
			messageError.html("<h2>Unable to retrieve your location</h2>").show();
			loader.hide();
		}

		//show loader
		loader.show();

		//return position
		navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy:true, timeout:60000, maximumAge:0});
	};
	
	//start geolocation
	geolocateUser();
	
	function getWeather(latitude, longitude) {
		console.log("getting weather");
		//Grab data from Open weather map API and dynamically build it on the page
		$.ajax({
			url: "http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&lat=" + latitude + "&lon=" + longitude + "&APPID=0d9a4b31b395cdaeb71feec7a32057a7",
			dataType: "json",
			success: function(data) {
				//log all JSON data returned
				console.log(data);
				
				//Set weather variables
				var city = data.name;
				var temp = data.main.temp;
				var minTemp = data.main.temp_min;
				var maxTemp = data.main.temp_max;
				var weatherDesc = data.weather[0].description;
				var humid = data.main.humidity;
				
				//Set weather theme
				if(temp > 0 && temp <= 8){
					 $("body").addClass("theme-1");
				}
				else if(temp > 8 && temp <= 16){
					 $("body").addClass("theme-2");
				}
				else if(temp > 16 && temp <= 24){
					 $("body").addClass("theme-3");
				}
				else if(temp > 24 && temp <= 32){
					 $("body").addClass("theme-4");
				}
				else if(temp > 32){
					 $("body").addClass("theme-5");
				}
				
				//Build html for weather results
				var weatherTemplate = ""
				weatherTemplate += 
					"<div class='temp'>" + parseInt(temp) + "<span>&deg;C</span><div class='temp-lowhigh'>(" + minTemp + " - " + maxTemp + ")</div></div>" + 
					"<div class='city'>City: " + city + "</div>" +
					"<div class='desc'>Description: " + weatherDesc + "</div>" +
					"<div class='humidity'>Humidity: " + humid + "%" + "</div>"	+
					"<div class='refresh'>" + "<a href='javascript:void(0);' class='btn btn-refresh' id='refresh'>Refresh</a>" + "</div>"					
				;
				
				//render weather on page				
				weatherContainer.html(weatherTemplate);
				
				//hide loader
				loader.hide();
			},
			error: function() {
				console.log('Json not loading: Unable to retrieve your data');
			}
		});
	};
	
};

//script instantiation after document ready
$(document).ready(function () {
	//trigger setFooterSpace on page load and window resize
	setFooterSpace();
	$(window).resize(setFooterSpace);
	
	//refresh function
	$("body").on("click", "#refresh", function () {
		initWeather();
	});
	
	//init weather application
	initWeather();
});