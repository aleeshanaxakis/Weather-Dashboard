var APIKey = "4b7f4787db0f7660827d3ad9e61764da";

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var city = document.getElementById("cityInput").value;
    var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + encodeURIComponent(city) + "&appid=" + APIKey;

    fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");  
            }
            return response.json();
        })
        .then(currentWeatherData => {
            return fetch(forecastURL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(forecastData => {
                    var weatherInfo = document.getElementById("weatherInfo");
                    weatherInfo.innerHTML = `City: ${currentWeatherData.name}<br>
                                            Temperature: ${currentWeatherData.main.temp} K<br>
                                            Weather: ${currentWeatherData.weather[0].description}<br><br>
                                            5-Day Forecast:`;

                    var forecastList = forecastData.list;
                    for (var i = 0; i < forecastList.length; i += 8) {
                        var forecast = forecastList[i];
                        var date = new Date(forecast.dt * 1000);
                        weatherInfo.innerHTML += `<br>Date: ${date.toDateString()}<br>
                                                Temperature: ${forecast.main.temp} K<br>
                                                Weather: ${forecast.weather[0].description}<br><br>`;
                    }
                })
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});