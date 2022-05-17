// Configuration ==============================================
var qSearch = "pizza"
var userLocation = "los angeles"


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
