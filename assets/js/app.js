// Configuration ==============================================
var qSearch = "pizza"
var userLocation = "78729"
var lat = 0
var long = 0
var city = ""
var state = ""

// Foursquare ==============================================
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'fsq3tG/J+x68WkLO19crXTBbrnDq/aCfvCO5YHaVAIeMPHs='
    }
  };
  
  fetch(`https://api.foursquare.com/v3/places/search?query=${qSearch}&near=${userLocation}`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data.results[0])
    
    })

    .catch(err => console.error(err))


// Accuweather ==============================================
// Get location key from user zipcode
function locationCode(){
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${keys.weather}&q=${userLocation}`)
    .then(res => res.json())
    .then(data => { 
        console.log(data[0])
        lat = data[0].GeoPosition.Latitude
        long = data[0].GeoPosition.Longitude
        city = data[0].EnglishName
        state = data[0].AdministrativeArea.EnglishName
        getWeatherConditions(data[0].Key)
    })
}

// get current conditions 
function getWeatherConditions(weatherLocKey){
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${weatherLocKey}?apikey=${keys.weather}`)
    .then(res => res.json())
    .then(data => {
        console.log(data[0])
    })
}

