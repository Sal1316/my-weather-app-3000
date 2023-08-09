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
      // console.log("cityName: ", cityName);
      getLatAndLong(cityName);
      // fetchWeatherForcast(cityName);
}
function onCityBtnClick(event) { // on city button click, pass the inner text to the fetchWeatherForecast fx.
      event.preventDefault();
      var cityName = event.target.innerText;

      console.log("oncityNameBtnClick: ", cityName);
      // call 
      getLatAndLong(cityName);
      // fetchWeatherForcast(cityName); // dont need bc its being replaced with getFiveDayForecast().
      // renderBottomCards()
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
                  console.log("latitude: " + lat + " longitude: " + lon);

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
                  console.log("getFiveDayForecast", data);
                  // var lists = data.list
                  renderWeather(data);
                  renderBottomCards(data);
            });
}
/*
// function fetchWeatherForcast(query) { // NOT SURE IF WE NEE THIS FX. COMBINE WITH getFiveDayForecast()
//       var url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&per_page=5&appid=${apiKey}`;

//       fetch(url, {
//             method: "GET", //GET is the default.*GET, POST, PUT, DELETE, etc.
//             credentials: "same-origin", // include, *same-origin, omit
//             redirect: "follow", // manual, *follow, error
//             units: "imperial",
//       })
//             .then(function (response) {
//                   return response.json(); // need to have the return here so we can use the next .then to get the response data.
//             })
//             .then(function (data) {
//                   // console.log("Forecast Data:", data);
//                   renderWeather(data);
//                   // renderBottomCards(data);
//             });
// }
*/
function renderWeather(forecast) {// assigns the json objects values, to their respective element on the single current weather day.    
      var cityName = forecast.city.name;
      var cityTemp = kelvinToFahrenheit(forecast.list[0].main.temp); // [0] will eventually be replaced with i. 
      var cityWind = forecast.list[0].wind.speed;
      var cityHumid = forecast.list[0].main.humidity;
      console.log("renderWeather: " + cityName + ", " + cityTemp + ", " + cityWind + ", " + cityHumid)

      var resultsContainer = document.getElementById("currentWeather"); // convert to jquery after working

      var city = document.createElement("h2"); // js or jquery preffered
      city.textContent = cityName;
      city.classList.add("cityDate"); // adding cityDate class
      resultsContainer.append(city); // append to html.

      var timeStamp = forecast.list[0].dt;
      var dateObj = dayjs.unix(timeStamp);
      var formattedDate = dateObj.format('MM/DD/YYYY');
      // var titleHeader =document.getElementByClassName('cityDate');
      resultsContainer.append(formattedDate); // add next to h2.

      var temp = document.createElement("p");
      temp.textContent = "Temp: " + cityTemp + " ℉";
      resultsContainer.append(temp);

      var wind = document.createElement("p");
      wind.textContent = "Wind: " + cityWind + " mph";
      resultsContainer.append(wind);

      var humidity = document.createElement("p");
      humidity.textContent = "Humidity: " + cityHumid + " %";
      resultsContainer.append(humidity);

}
function renderBottomCards(forecast) {
      console.log("renderBottomCards: ", forecast);

      // var dayCardsContainer = $("#dayCards");
      // var data = forecast.list;  // data = 40 arrays
      // console.log("Data:", data);// 

      // for (var i = 0; data.length < 5; i += 8) { // loops over the midnight time. every 8th array.
      //       console.log("entered for loop!!!!!!!!!!");
      //       var timeStamp = forecast.list[i].dt;
      //       var dateObj = dayjs.unix(timeStamp);
      //       var formattedDate = dateObj.format('MM/DD/YYYY');

      //       // create elements.
      //       var card = $(`<div class="card${i}"></div>`); // js or jquery preffered
      //       var date = $('<p>' + formattedDate + '</p>');
      //       var ol = $('<ol><li>Temp: ' + data[i].main.temp + '</li><li>Wind: ' + data[i].wind.speed + '</li><li>Humidity: ' + data[i].main.humidity + '</li></ol>');

      //       card.append(date);
      //       card.append(ol);
      //       dayCardsContainer.append(card); // you have to sequence these to have nested elements.

      //       console.log("renderBottomCards-dayCardsContainer: ", dayCardsContainer) // day 1 

      // }

}

function kelvinToFahrenheit(k) {
      var f = ((k - 273.15) * 1.8) + 32;
      return Math.ceil(f);
}


/* Bugs: 
- not clearing the data when you select a different city.
- should probrably have a default city loaded first, then user can change it.



*/
