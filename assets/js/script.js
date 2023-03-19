// Current Weather API Fetch
let weather = {
   apiKey: "78e9e14dad5498aac8b2130d90de0a24",
   searchHistory: [], // Initialize an empty array to store the searched cities
   fetchWeather: function (city) {
      fetch("https://api.openweathermap.org/data/2.5/weather?q="
         + city
         + "&units=imperial&cnt=5&appid="
         + this.apiKey)
         .then((response) => response.json())
         .then((data) => {
            this.displayWeather(data);
            this.fetchForecast(data.coord.lat, data.coord.lon);
            this.addToHistory(city); // Add the searched city to the history array
         });
   },
   //Forecast Weather API Fetch
   fetchForecast: function (lat, lon) {
      fetch(
         "https://api.openweathermap.org/data/2.5/forecast?lat="
         + lat
         + "&lon="
         + lon
         + "&units=imperial&appid="
         + this.apiKey)
         .then((response) => response.json())
         .then((data) => this.displayForecast(data.list));
   },

   // Add the searched city to the history array
   addToHistory: function (city) {
      if (!this.searchHistory.includes(city)) {
         this.searchHistory.unshift(city); // Add the searched city to the beginning of the array
         this.displayHistory(); // Update the search history display
      }
   },

   // Display the search history
   displayHistory: function () {
      const historyList = document.querySelector('.search-history');
      historyList.innerHTML = ''; // Clear the previous search history

      // Loop through the search history array and create HTML elements for each searched city
      for (let i = 0; i < this.searchHistory.length; i++) {
         const city = this.searchHistory[i];
         const historyItem = document.createElement('li');
         historyItem.textContent = city;
         historyItem.addEventListener('click', function () {
            weather.fetchWeather(city); // Fetch the weather data for the selected city
         });
         historyList.appendChild(historyItem);
      }
   },
   // Displaying API info
   displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      console.log(name, icon, description, temp, humidity, speed);
      document.querySelector('.city-name').innerText = 'Weather in ' + name;
      document.querySelector('.icon').src = 'https://openweathermap.org/img/wn/' + icon + '.png';
      document.querySelector('.temp').innerText = temp + '°';
      document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
      document.querySelector('.wind').innerText = 'Wind speed: ' + speed + ' mph';
   },

   // Displaying the Date for the Forcast
   displayDate: function () {
      const currentDate = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = currentDate.toLocaleDateString('en-US', options);
      document.querySelector('.current-date').textContent = dateString;
      document.querySelector('.date').innerText = date;
   },


   // Displaying the Forcast
   displayForecast: function (forecastData) {
      const forecastCardsContainer = document.querySelector('.forecast-cards');
      forecastCardsContainer.innerHTML = '';

      for (let i = 0; i < forecastData.length; i += 8) {
         let forecastItem = forecastData[i];
         const { dt_txt } = forecastItem;
         const { icon } = forecastItem.weather[0];
         const { temp, humidity } = forecastItem.main;
         const { speed } = forecastItem.wind;

         const forecastCardHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${new Date(dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</h5>
          <p class="card-text">${new Date(dt_txt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          <img class="card-icon" src="https://openweathermap.org/img/wn/${icon}.png">
          <p class="card-temp">${temp}°</p>
          <p class="card-humidity">Humidity: ${humidity}%</p>
          <p class="card-wind">Wind speed: ${speed} mph</p>
        </div>
      </div>
    `;

         forecastCardsContainer.innerHTML += forecastCardHTML;
      }
   },

   search: function () {
      this.fetchWeather(document.querySelector('.searchbar').value);
   }
};

document.querySelector('.button').addEventListener('click', function () {
   weather.search();
});

document.querySelector('.searchbar').addEventListener('keyup', function (event) {
   if (event.key == "Enter") {
      weather.search();
   }
}); 
