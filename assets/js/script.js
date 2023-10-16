// OpenWeatherMap API key 
var APIKey = "4b7f4787db0f7660827d3ad9e61764da";

// Array to store search history
var searchHistory = [];

// Function to fetch weather data for a specific city
function fetchWeatherData (city) {
    var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&appid=" + APIKey;
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + encodeURIComponent(city) + "&appid=" + APIKey;

    // Fetch current weather data
    fetch(currentWeatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");  
            }
            return response.json();
        })
        .then(currentWeatherData => {
            // Update search history and display weather information
            if (!searchHistory.includes(city)) {
                searchHistory.push(city);
                updateSearchHistory();
            }

            // Fetch forecast data
            return fetch(forecastURL)
                .then(response => response.json())
                .then(forecastData => {
                    updateWeatherInfo(currentWeatherData, forecastData);
                })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        });
}

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var city = document.getElementById("cityInput").value;
    fetchWeatherData(city)
});    

    function updateWeatherInfo(currentWeatherData, forecastData) {
        var weatherInfo = document.getElementById("weatherInfo");
        var city = currentWeatherData.name;
        var currentDate = dayjs().format('MM/DD/YYYY');
        var temperature = currentWeatherData.main.temp;
        var windSpeed = currentWeatherData.wind.speed;
        var humidity = currentWeatherData.main.humidity;
        var icon = currentWeatherData.weather[0].icon;
        console.log(currentWeatherData);

        weatherInfo.innerHTML = `<h2>${city} (${currentDate}) <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/> </h2>
                                <p>Temperature: ${temperature} K</p>
                                <p>Wind: ${windSpeed} m/s</p>
                                <p>Humidity: ${humidity}%</p>
                                5-Day Forecast:`;
        console.log(forecastData);

        var forecastList = forecastData.list;
        for (var i = 0; i < forecastList.length; i += 8) {
        var forecast = forecastList[i];
        console.log(forecast);
        var date = new Date(forecast.dt * 1000);
        var temperature = forecast.main.temp;
        var windSpeed = forecast.wind.speed;
        var icon = forecast.weather[0].icon;
        console.log(icon);
        weatherInfo.innerHTML += `<br>${date.toDateString()}<br> <img src="https://openweathermap.org/img/wn/${icon}@2x.png"/>
                                <p>Temperature: ${temperature} K</p>
                                <p>Wind: ${windSpeed} m/s</p>
                                <p>Humidity: ${humidity}%</p>`
        }
    }

function updateSearchHistory() {
    var searchHistoryContainer = document.getElementById("searchHistory");
    searchHistoryContainer.innerHTML = "";
    searchHistory.forEach(city => {
        var button = document.createElement("button");
        button.textContent = city;
        button.addEventListener("click", function(event) {
            var cityName = event.target.textContent;
            // Fetch and display both current weather and forecast for the clicked city
            fetchWeatherData(cityName);
        });
        searchHistoryContainer.appendChild(button);
    });
    // Save searchHistory to localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
