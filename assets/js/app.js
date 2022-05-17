// Configuration ==============================================
var userQuery = "pizza"
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
  
  function getUserQuery(ll){
    fetch(`https://api.foursquare.com/v3/places/search?query=${userQuery}&ll=${ll}&radius=8500`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data.results[0])
        
    
    })

    .catch(err => console.error(err))

  }


