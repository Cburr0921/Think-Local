// Configuration ==============================================
var searchDiv = document.getElementById("search-results")

var weatherResultsDiv = document.getElementById("weather-results")

var photoArray = [null, null, null, null, null, null, null, null, null, null];

var userQuery = "park"
var userLocation = {
    zip: "78729",
    lat: 0,
    long: 0,
    city: "",
    state: ""
}

// Accuweather ==============================================
// Get location key from user zipcode
function locationCode(){
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${keys.weather}&q=${userLocation.zip}`)
    .then(res => res.json())
    .then(data => { 
        console.log(data[0])
        userLocation.lat = data[0].GeoPosition.Latitude
        userLocation.long = data[0].GeoPosition.Longitude
        userLocation.city = data[0].EnglishName
        userLocation.state = data[0].AdministrativeArea.EnglishName
        var ll = `${data[0].GeoPosition.Latitude},${data[0].GeoPosition.Longitude}`
        getUserQuery(ll)
        getWeatherConditions(data[0].Key)
    })
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again."
    });

}


function weatherDiv(weather){
    // display city, state, tempature, and icon
    weatherResultsDiv.innerHTML = "";
    var location = document.createElement("p")
    location.textContent = `${userLocation.city}, ${userLocation.state}`

    var tempature = document.createElement("p")
    tempature.textContent = `${weather.Temperature.Imperial.Value} °F | ${weather.WeatherText}`

    var icon = document.createElement("img")
    var num =  `0${weather.WeatherIcon}`
    icon.setAttribute("src", `https://developer.accuweather.com/sites/default/files/${(weather.WeatherIcon < 10? num : weather.WeatherIcon)}-s.png`)
    icon.setAttribute("alt", weather.WeatherText)

    weatherResultsDiv.append(location, tempature, icon)

//weather.WeatherIcon


}

// get current conditions 
function getWeatherConditions(weatherLocKey){
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${weatherLocKey}?apikey=${keys.weather}`)
    .then(res => res.json())
    .then(data => {
        console.log(data[0])
        weatherDiv(data[0])
    })
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again."
    });
}



// Foursquare ==============================================
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: keys.foursquare
    }
  };

function photoResults(resultsId, i, name){
    fetch(`https://api.foursquare.com/v3/places/${resultsId}/photos`, options)
    .then(res => res.json())
    .then(data => {
        // console.log(data[0])
        var prefix = data[0].prefix;
        var suffix = data[0].suffix;
        var photoUrl = `${prefix}200x200${suffix}`;

        var photoImg = document.createElement("img");
        photoImg.setAttribute("src", photoUrl);
        photoImg.setAttribute("alt", name);

        photoArray[i] = photoImg;

    })
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again.";
    });
}

function addImg(){
    var resultWraps = document.querySelectorAll(".result-wrap");
    for(var i = 0; i < resultWraps.length; i++){
        resultWraps[i].prepend(photoArray[i]);
    }
}

function createResultDivs(data){
    searchDiv.innerHTML = "";
    var a = data.results;
    for(var i = 0; i < a.length; i++){
        var meterToMile = a[i].distance / 1609;
        var miles = meterToMile.toFixed(1);
        resultsId = a[i].fsq_id;

        photoResults(resultsId, i, a[i].name);

        var resultDiv = document.createElement("div");
        resultDiv.setAttribute("class", "result-wrap");

        var name = document.createElement("h2");
        name.setAttribute("class", "biz-name");
        name.textContent = a[i].name;

        var bizLocation = document.createElement("h3");
        bizLocation.setAttribute("class", "addy");
        bizLocation.textContent = `Address: ${a[i].location.formatted_address}`;

        var bDistance = document.createElement("h4");
        bDistance.setAttribute("class", "distance");
        bDistance.textContent = `Distance: ${miles} miles`;

        resultDiv.append(name, bizLocation, bDistance);

        searchDiv.appendChild(resultDiv);
    
        
    }
    setTimeout(addImg, 800);
  
}
  
function getUserQuery(ll){
    fetch(`https://api.foursquare.com/v3/places/search?query=${userQuery}&ll=${ll}&radius=32000`, options)
    .then(res => res.json())
    .then(data => {
        createResultDivs(data);

    })
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again.";
    });
}

document.addEventListener("click", function(event){
    event.preventDefault();

    if (event.target.id === "search-btn") {
        searchDiv.textContent = "";

        var actInput =  document.getElementById("activities");
        var zipInput = document.getElementById("zip");
        userQuery = actInput.value;
        userLocation.zip = zipInput.value;
        userLocation.zip.trim();
        if(userLocation.zip.length > 0){
            locationCode();

        }
        zipInput.value = "";
        actInput.value = "food";

        // reset the two values back to empty 
    }if(event.target.id === "scroll-btn"){
        topFunction();
    }


})

//Get the button
var scrollBtn = document.getElementById("scroll-btn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
