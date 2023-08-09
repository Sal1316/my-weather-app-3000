$(document).ready(function () {
      getLatAndLong('Atlanta');
});

// Elements: 
var searchBtnEl = $("#searchBtn");
var cityBtns = $("#cityBtns");
var apiKey = "2b968bda86e14018b6589f7ec132923f";

// Event Handlers:
searchBtnEl.on("click", onSeachBtnClick);
cityBtns.on("click", onCityBtnClick);

// Functions:
function onSeachBtnClick() {
      var cityName = $("#cityInput").val(); // get the value inputed.

      getLatAndLong(cityName);
}
function onCityBtnClick(event) { // on city button click, pass the inner text to the fetchWeatherForecast fx.
      event.preventDefault();
      var cityName = event.target.innerText;

      getLatAndLong(cityName);
}
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
      var url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(url, {
            method: "GET", //GET is the default.*GET, POST, PUT, DELETE, etc.
            credentials: "same-origin", // include, *same-origin, omit
            redirect: "follow", // manual, *follow, error
            units: "imperial",
      })
            .then(function (response) {
                  return response.json(); // need to have the return here so we can use the next .then to get the response data.
            })
            .then(function (data) {
                  renderWeather(data);
                  renderBottomCards(data);
            });
}
function renderWeather(forecast) {// assigns the json objects values, to their respective element on the single current weather day.    
      var cityName = forecast.city.name;
      var cityTemp = kelvinToFahrenheit(forecast.list[0].main.temp); // [0] will eventually be replaced with i. 
      var cityWind = forecast.list[0].wind.speed;
      var cityHumid = forecast.list[0].main.humidity;
      var resultsContainer = $("#currentWeather");

      var timeStamp = forecast.list[0].dt;
      var dateObj = dayjs.unix(timeStamp);
      var formattedDate = dateObj.format('MM/DD/YYYY');

      var city = $('<h2 class="cityName">' + cityName + " " + formattedDate + '</h2>');
      resultsContainer.append(city);
      var temp = $('<p class="cityTemp">Temp: ' + cityTemp + ' ℉</p>');
      resultsContainer.append(temp);
      var wind = $('<p class="cityWind">Wind: ' + cityWind + ' mph</p>');
      resultsContainer.append(wind);
      var humidity = $('<p class="cityWind">Humidity: ' + cityHumid + '%</p>');
      resultsContainer.append(humidity);
}
function renderBottomCards(forecast) {
      var dayCardsContainer = $("#dayCards");
      var data = forecast.list;  // data = 40 arrays of times

      for (var i = 0; i < data.length; i += 8) { // loops over the midnight time. every 8th array.
            var dateObj = dayjs.unix(forecast.list[i].dt); // gets the date stamp number and coverts it to date format.
            var formattedDate = dateObj.format('MM/DD/YYYY');

            var cardTemp = kelvinToFahrenheit(data[i].main.temp);
            var cardWind = data[i].wind.speed;
            var cardHumid = data[i].main.humidity

            // create and assign elements. $(<div>) = creating. $('div') = accessing.
            var card = $('<div class="card"></div>'); // js or jquery preffered
            var date = $('<p class="forDate">' + formattedDate + '</p>');
            var ol = $('<ol class="twm"><li>Temp: ' + cardTemp + ' ℉' + '</li><li>Wind: ' + cardWind + ' mph' + '</li><li>Humidity: ' + cardHumid + ' %' + '</li></ol>');

            card.append(date);
            card.append(ol);
            dayCardsContainer.append(card); // you have to sequence these to have nested elements.
      }
}
function kelvinToFahrenheit(k) {
      var f = ((k - 273.15) * 1.8) + 32;
      return Math.ceil(f);
}
function iconChooser(temp, cloud, rain, thunder) {
      /* 
      if(temp > 90){ //if statment that compares the temp, cloud, and rain that returns an icon
            show a sun icon
      } else if()
      */
}


/* Bugs: 

- should store data in localStorge so you dont make a call every time.

- not clearing the data when you select a different city.

- if time permits, get a background to show on current weather element.

*/
