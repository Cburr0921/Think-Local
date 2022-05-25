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

function weatherDiv(weather){
    // display city, state, tempature, and icon
    weatherResultsDiv.innerHTML = "";

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "container")
  
    var widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("class", "widget");

    var detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("class", "details");

    var pictoCloudFillDiv = document.createElement("div");
    pictoCloudFillDiv.setAttribute("class", "pictoCloudFill");

    var iconCloudFillDiv = document.createElement("div");
    iconCloudFillDiv.setAttribute("class", "iconCloudFill");

    var wTemperatureDiv = document.createElement("div");
    wTemperatureDiv.setAttribute("class", "temperature");
    wTemperatureDiv.textContent = `${weather.Temperature.Imperial.Value}`;

    var fDeg =  document.createElement("p");
    fDeg.setAttribute("class", "f-degree");
    fDeg.textContent = " °F";
    wTemperatureDiv.appendChild(fDeg);

    var summaryDiv = document.createElement("div");
    summaryDiv.setAttribute("class", "summary");

    var summaryTextDiv = document.createElement("p");
    summaryTextDiv.setAttribute("class", "summaryText");
    summaryTextDiv.textContent = `${weather.WeatherText}`;

    var pictoBackdropDiv = document.createElement("div");
    pictoBackdropDiv.setAttribute("class", "pictoBackdrop");

    var pictoFrameDiv = document.createElement("div");
    pictoFrameDiv.setAttribute("class", "pictoFrame");

    var icon = document.createElement("img");
    var num =  `0${weather.WeatherIcon}`;
    icon.setAttribute("src", `https://developer.accuweather.com/sites/default/files/${(weather.WeatherIcon < 10? num : weather.WeatherIcon)}-s.png`);
    icon.setAttribute("alt", weather.WeatherText);
    icon.setAttribute("class", "weather-icon");

    var cityStateDiv = document.createElement("div");
    cityStateDiv.textContent = `${userLocation.city}, ${userLocation.state}`;
    cityStateDiv.setAttribute("class", "city-div");

    var wStateDiv = document.createElement("div");
    wStateDiv.setAttribute("class", "state-div");
    wStateDiv.textContent = `${userLocation.state}`;

    detailsDiv.append(wTemperatureDiv, summaryDiv, cityStateDiv);

    summaryDiv.appendChild(summaryTextDiv);
    
    pictoFrameDiv.appendChild(icon);

    widgetDiv.append(pictoBackdropDiv, pictoFrameDiv, detailsDiv);

    containerDiv.appendChild(widgetDiv);

    weatherResultsDiv.appendChild(containerDiv);

}


// get current conditions 
function getWeatherConditions(weatherLocKey){
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${weatherLocKey}?apikey=${keys.weather}`)
    .then(res => res.json())
    .then(data => {
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
        
       
        var prefix = data[0].prefix;
        var suffix = data[0].suffix;
        var photoUrl = `${prefix}200x200${suffix}`;
        
        
        var img = document.createElement("img");
        img.setAttribute("class", "biz-img");
        img.setAttribute("src", photoUrl);
        img.setAttribute("alt", name);


        // var photoImg = document.createElement("img");
        // photoImg.setAttribute("src", photoUrl);
        // photoImg.setAttribute("alt", name);
        
        photoArray[i] = img;

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
/*
<!-- <figure class="mix work-item branding">
    <img src="./assets/img/works/item-1.jpg" alt="">
    <figcaption class="overlay">
        <h4>Labore et dolore magnam</h4>
        <p>Photography</p>
    </figcaption>
</figure> -->
*/
function createResultDivs(data){
    searchDiv.innerHTML = "";
    var a = data.results;
    for(var i = 0; i < a.length; i++){
        var meterToMile = a[i].distance / 1609;
        var miles = meterToMile.toFixed(1);
        resultsId = a[i].fsq_id;

        photoResults(resultsId, i, a[i].name);

        var figure = document.createElement("figure");
        figure.setAttribute("class", "work-item result-wrap");
        //mix work-item branding
        

        var figCaption = document.createElement("figcaption");
        figCaption.setAttribute("class", "overlay");

        var h4 = document.createElement("h4");
        h4.setAttribute("class", "biz-name");
        h4.textContent = a[i].name;

        var pTag = document.createElement("p");
        pTag.setAttribute("class", "address");
        pTag.textContent = `Address: ${a[i].location.formatted_address}`;

        var pDistanceTag = document.createElement("p");
        pDistanceTag.setAttribute("class", "distance");
        pDistanceTag.textContent = `Distance: ${miles} miles`;

        var directions = document.createElement("a")
        directions.setAttribute("class", "btn btn-primary")
        //113+N+Robertson+Blvd,+Los+Angeles,+CA+90048
       
        var fAddy = a[i].location.formatted_address
        fAddy = fAddy.replace(/ /g, '+');
        directions.setAttribute("href", `https://www.google.com/maps/place/${fAddy}/`)
        directions.setAttribute("target", "_blank")
        directions.textContent = "Get Directions"

        figCaption.append(h4, pTag, pDistanceTag, directions);

        figure.appendChild(figCaption);

        searchDiv.appendChild(figure);

        var actResults = document.getElementById("activity-results")
        actResults.textContent = userQuery

        




       

        // var resultDiv = document.createElement("div");
        // resultDiv.setAttribute("class", "result-wrap");

        // var name = document.createElement("h2");
        // name.setAttribute("class", "biz-name");
        // name.textContent = a[i].name;

        // var bizLocation = document.createElement("h3");
        // bizLocation.setAttribute("class", "addy");
        // bizLocation.textContent = `Address: ${a[i].location.formatted_address}`;

        // var bDistance = document.createElement("h4");
        // bDistance.setAttribute("class", "distance");
        // bDistance.textContent = `Distance: ${miles} miles`;

        // resultDiv.append(name, bizLocation, bDistance);

        // searchDiv.appendChild(resultDiv);
    
        
    }
    setTimeout(addImg, 800);
  
}
  
function getUserQuery(ll){
    fetch(`https://api.foursquare.com/v3/places/search?query=${userQuery}&ll=${ll}&radius=17000&limit=20&offset=2649`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        createResultDivs(data);

    })
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again.";
    });
}

document.addEventListener("click", function(event){
   

    if (event.target.id === "search-btn") {
        event.preventDefault();
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

