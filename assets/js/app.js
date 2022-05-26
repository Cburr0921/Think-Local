// Configuration ==============================================
//christian
//global variables
var year = document.getElementById("year");
var searchDiv = document.getElementById("search-results");
var weatherResultsDiv = document.getElementById("weather-results");

//array needed to push images because of scoping issue
var photoArray = [null, null, null, null, null, null, null, null, null, null];

var userQuery = "park"
var userLocation = {
    zip: "78729",
    lat: 0,
    long: 0,
    city: "",
    state: ""
}
//david
year.innerText = new Date().getFullYear()
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

//david
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
//david
function weatherDiv(weather){
    // display city, state, tempature, and icon
    weatherResultsDiv.innerHTML = "";

    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "container-w")
  
    var widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("class", "widget");

    var detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("class", "details-w");

    var pictoCloudFillDiv = document.createElement("div");
    pictoCloudFillDiv.setAttribute("class", "pictoCloudFill");

    var iconCloudFillDiv = document.createElement("div");
    iconCloudFillDiv.setAttribute("class", "iconCloudFill");

    var wTemperatureDiv = document.createElement("div");
    wTemperatureDiv.setAttribute("class", "temperature-w");
    wTemperatureDiv.innerHTML = `${weather.Temperature.Imperial.Value}<sup>°F</sup>`;

    var summaryDiv = document.createElement("div");
    summaryDiv.setAttribute("class", "summary-w");

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
//david
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
//object with header and api key to pass in fetch request (required).
//christian 
const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: keys.foursquare
    }
  };
//christian
function photoResults(resultsId, i, name){
    fetch(`https://api.foursquare.com/v3/places/${resultsId}/photos`, options)
    .then(res => res.json())
    .then(data => {
        //image path to object is broken up in 2 parts with Dimensions desired inbetween
        var prefix = data[0].prefix;
        var suffix = data[0].suffix;
        var photoUrl = `${prefix}200x200${suffix}`;
        
        var img = document.createElement("img");
        img.setAttribute("class", "biz-img");
        img.setAttribute("src", photoUrl);
        img.setAttribute("alt", name);

        photoArray[i] = img;

    })
    .catch(err => {
        //Errors from ajax/api call will console log and display "Opps!" message to page
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again.";
    });
}
//christian
function addImg(){
    var resultWraps = document.querySelectorAll(".result-wrap");
    //loop through prepending photo in same order with results
    for(var i = 0; i < resultWraps.length; i++){
        resultWraps[i].prepend(photoArray[i]);
    }
}

//christian
//function that creates a div for each result, data is passed in
function createResultDivs(data){
    //clear search div 
    searchDiv.innerHTML = "";
    var a = data.results;
    //loop through object array to create div 
    for(var i = 0; i < a.length; i++){
        //convert meters to miles
        var meterToMile = a[i].distance / 1609;
        //reduce mile to tenths place example: 8.6748459 = 8.6 miles
        var miles = meterToMile.toFixed(1);
        //get id of result to pass into function that creates photoResult
        resultsId = a[i].fsq_id;

        //call function and pass in parameteters to create photo
        photoResults(resultsId, i, a[i].name);
        //create elements example on line 190
        var figure = document.createElement("figure");
        figure.setAttribute("class", "work-item result-wrap");
        
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

        var directions = document.createElement("a");
        directions.setAttribute("id", "directions-button");
        directions.setAttribute("class", "btn");
       
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

        var workSection = document.getElementById("works");
        workSection.classList.remove("hide");
        
    }
    //4loop runs faster than api call can retrieve img object. SetTimeout of 800ms delay is fix
    setTimeout(addImg, 800);
  
}
//christian  
function getUserQuery(ll){
    fetch(`https://api.foursquare.com/v3/places/search?query=${userQuery}&ll=${ll}&radius=17000&limit=20&offset=2649`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        createResultDivs(data);

    })
    //any errors from ajax/api call will console log and display "Opps!" message to page
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again.";
    });
}

//click event listener for whole page
//david
document.addEventListener("click", function(event){
    if (event.target.id === "search-btn") {
        //Prevents page from reloading
        event.preventDefault();
        //clearing the search Div
        searchDiv.textContent = "";

        //getting elements to hook onto
        var actInput =  document.getElementById("activities");
        var zipInput = document.getElementById("zip");

        //get values from user (zipcode & activity) and push to object
        userQuery = actInput.value;
        userLocation.zip = zipInput.value;
        //remove whitespace from user zip input
        userLocation.zip.trim();

        if(userLocation.zip.length > 0){
            locationCode();
        }
        // reset the zip inputbox values empty after searach
        zipInput.value = "";
        //Reset dropdown to food catagory after search
        actInput.value = "food";

    }


})

