$(document).ready(function () {
      getLatAndLong('Atlanta');
      displayCityNames();
});

// Elements: 
var searchBtnEl = $("#searchBtn");
var cityBtns = $("#cityBtns");
var apiKey = "2b968bda86e14018b6589f7ec132923f";
var cityHistory = [];

// Event Handlers:
searchBtnEl.on("click", function () {
      var cityName = $("#cityInput").val(); // get the value inputed.
      getLatAndLong(cityName);
      // NEED TO SAVE TEH CITY NAME IN THE LOCAL STORAGE
      // displayCityNames() 
      saveCityName(cityName);
      displayCityNames();
});
cityBtns.on("click", function (event) { // on city button click, pass the inner text to the fetchWeatherForecast fx.
      event.preventDefault();
      var cityName = event.target.innerText;
      getLatAndLong(cityName);
});

// Functions:
function getLatAndLong(city) { // fx gets the latitude and longitude coordinates for the inputed city.
      var url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      fetch(url)
            .then(function (response) {
                  return response.json(); // need to have the return here so we can use the next .then to get the response data.
            })
            .then(function (data) {
                  var lat = data[0].lat;
                  var lon = data[0].lon;

                  getFiveDayForecast(lat, lon);
            });
}
function getFiveDayForecast(lat, lon) {
      var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

      fetch(url, {
            method: "GET", //GET is the default.*GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            // units: "imperial",
      })
            .then(function (response) {
                  return response.json(); // need to have the return here so we can use the next .then to get the response data.
            })
            .then(function (data) {
                  renderWeather(data);

                  renderBottomCards(data);
                  console.log("renderBottomCards: ", data);
            });
}
function renderWeather(forecast) {// assigns the json objects values, to their respective element on the single current weather day.    
      $("#currentWeather").empty();// clears values default values before rendering:

      console.log('forecast: ', forecast);
      var cityName = forecast.city.name;
      var cityTemp = forecast.list[0].main.temp; // [0] will eventually be replaced with i. 
      var cityWind = forecast.list[0].wind.speed;
      var cityHumid = forecast.list[0].main.humidity;
      var cityWeather = forecast.list[0].weather[0].main; // the main can displays: "Clear", "Rain", "Ligh Rain", "Clouds", and more.

      var resultsContainer = $("#currentWeather");

      var timeStamp = forecast.list[0].dt;
      var dateObj = dayjs.unix(timeStamp);
      var formattedDate = dateObj.format('MM/DD/YYYY');

      var city = $('<h2 class="cityName">' + cityName + " " + formattedDate + " " + '</h2>'); // doesnt let me add teh iconChooser finction directly to the query element.
      var icon = iconChooser(cityTemp, cityWeather);
      city.append(icon);
      resultsContainer.append(city);

      var temp = $('<p class="cityTemp">Temp: ' + cityTemp + ' ℉</p>');
      resultsContainer.append(temp);
      var wind = $('<p class="cityWind">Wind: ' + cityWind + ' mph</p>');
      resultsContainer.append(wind);
      var humidity = $('<p class="cityWind">Humidity: ' + cityHumid + '%</p>');
      resultsContainer.append(humidity);
}
function renderBottomCards(forecast) {
      $("#dayCards").empty();// clears values default values before rendering:

      var dayCardsContainer = $("#dayCards");
      var data = forecast.list;  // data = 40 arrays of times

      for (var i = 0 + 4; i < data.length; i += 8) { // loops over the midnight time. every 8th array.
            var dateObj = dayjs.unix(forecast.list[i].dt); // gets the date stamp number and coverts it to date format.
            var formattedDate = dateObj.format('MM/DD/YYYY');

            var cardTemp = data[i].main.temp;
            var cardWind = data[i].wind.speed;
            var cardHumid = data[i].main.humidity
            var cardWeather = data[i].weather[0].main;

            // $('<div>') = creating & $('div') = accessing.
            var card = $('<div class="card"></div>'); // js or jquery preffered
            var date = $('<p class="date">' + formattedDate + "  " + ' </p>');

            var iconHolder = $('<span class="icons"></span>');
            var icon = iconChooser(cardTemp, cardWeather);
            iconHolder.append(icon);
            var ol = $('<ol class="ol-li"><li>Temp: ' + cardTemp + ' &#8457;</li><li>Wind: ' + cardWind + ' mph' + '</li><li>Humidity: ' + cardHumid + ' %' + '</li></ol>');

            card.append(date);
            card.append(iconHolder);
            card.append(ol);
            dayCardsContainer.append(card); // you have to sequence these to have nested elements.
      }
}
function kelvinToFahrenheit(k) {
      var f = ((k - 273.15) * 1.8) + 32;
      return Math.ceil(f);
}
function iconChooser(temp, weather) {
      if (weather === "Clear") { //dont check rain or clouds.
            if (temp > 90) { //if statment that compares the temp, cloud, and rain that returns an icon
                  return $('<i class="fas fa-sun"></i>'); // hotter sun icon
            } else {
                  return $('<i class="fas fa-sun"></i>'); // hot sun icon
            }
      } else if (weather === 'Rain') { //"Clear", "Rain", "Ligh Rain", "Clouds"
            return $('<i class="fas fa-cloud-rain"></i>')
      } else if (weather === 'Clouds') {
            return $('<i class="fas fa-cloud"></i>')
      }
}

function saveCityName(cityName) {
      cityHistory.push(cityName);
      localStorage.setItem('searchHistory', JSON.stringify(cityHistory));
}
function displayCityNames() {
      var ciytHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
      console.log('ciytHistory: ', ciytHistory);

      var cityContainer = $('#cityHistory')
      ciytHistory.forEach(function (cityName) {
            var cityRow = $('<div></div>').text(cityName);
            cityContainer.append(cityRow);
      });
}


/* 
ToDo: 
- city names should be displayed below the search button.

Bugs: 


- local history deletes when you repeatedly enter names then refresh then enter more names.

- should display the high temperate and not the one at midnight.

- if time permits, get a background to show on current weather element.



*/
