// Configuration ==============================================
var searchDiv = document.getElementById("search-results")

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
}
locationCode();


// get current conditions 
function getWeatherConditions(weatherLocKey){
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${weatherLocKey}?apikey=${keys.weather}`)
    .then(res => res.json())
    .then(data => {
        console.log(data[0])
    })
}



// Foursquare ==============================================
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: keys.foursquare
    }
  };

  function createResultDivs(data){
    searchDiv.innerHTML = "";

    for(var i = 0; i < data.results.length; i++){
        var meterToMile = data.results[i].distance / 1609;
        var miles = meterToMile.toFixed(1);

        var resultDiv = document.createElement("div");
        resultDiv.setAttribute("id", "result-wrap");

        var name = document.createElement("h2");
        name.setAttribute("class", "biz-name");
        name.textContent = data.results[i].name;

        var bizLocation = document.createElement("h3");
        bizLocation.setAttribute("class", "addy");
        bizLocation.textContent = `Address: ${data.results[i].location.formatted_address}`;

        var bDistance = document.createElement("h4");
        bDistance.setAttribute("class", "distance");
        bDistance.textContent = `Distance: ${miles} miles`;

        resultDiv.append(name, bizLocation, bDistance);

        searchDiv.appendChild(resultDiv);

    }
  }
  
  function getUserQuery(ll){
    fetch(`https://api.foursquare.com/v3/places/search?query=${userQuery}&ll=${ll}&radius=16000`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data.results);
        createResultDivs(data);

    })

    .catch(err => console.error(err))

  }


