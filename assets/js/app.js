// Configuration ==============================================
//christian
//global variables
var year = document.getElementById("year");
var searchDiv = document.getElementById("search-results");
var weatherResultsDiv = document.getElementById("weather-results");

//array to push images into because of scoping issue
var photoArray = [null, null, null, null, null, null, null, null, null, null];

var userQuery = "park"
var userLocation = {
    zip: "78729",
    lat: 0,
    long: 0,
    city: "",
    state: ""
}

//dynamically update the year in the footer
year.innerText = new Date().getFullYear()

// Accuweather ==============================================
// Get location key from user zipcode
function locationCode(){
    fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${keys.weather}&q=${userLocation.zip}`)
    .then(res => res.json())
    .then(data => { 
        //save/get the values from object to use when dynamically creating elements (pushing to object?) 
        userLocation.lat = data[0].GeoPosition.Latitude
        userLocation.long = data[0].GeoPosition.Longitude
        userLocation.city = data[0].EnglishName
        userLocation.state = data[0].AdministrativeArea.EnglishName

        //saving the latitude and longitude as var ll 
        //(seperated by comma because 4square api call requires this in fetch
        var ll = `${data[0].GeoPosition.Latitude},${data[0].GeoPosition.Longitude}`

        //calling function and passing in ll variable from above
        getUserQuery(ll)
        
        //calling function and passing in data[0].key
        //api requires two calls, one to retrieve key of location, then using that key to get weather conditions
        getWeatherConditions(data[0].Key)
    })
    //any errors from ajax/api call will console log and display "Opps!" message to page
    .catch(err => {
        console.error(err)
        searchDiv.textContent = "Oops!... Something went wrong, check your zip code and try again."
    });

}

//dynamically create the weather div, passing in data[0] but declaring it weather
function weatherDiv(weather){
    //clear div beforehand
    weatherResultsDiv.innerHTML = "";

    //create div element w/class container-w
    var containerDiv = document.createElement("div");
    containerDiv.setAttribute("class", "container-w")
  
    //create div element w/class widget
    var widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("class", "widget");

    //create div element w/class details-w
    var detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("class", "details-w");

    //create div element w/class pictoCloudFill
    var pictoCloudFillDiv = document.createElement("div");
    pictoCloudFillDiv.setAttribute("class", "pictoCloudFill");

    //create div element w/class iconCloudFill
    var iconCloudFillDiv = document.createElement("div");
    iconCloudFillDiv.setAttribute("class", "iconCloudFill");

    //create div element w/class temperature-w, text of current temperature, °F wrapped in sup element
    var wTemperatureDiv = document.createElement("div");
    wTemperatureDiv.setAttribute("class", "temperature-w");
    wTemperatureDiv.innerHTML = `${weather.Temperature.Imperial.Value}<sup>°F</sup>`;

    //create div element w/class summary-w
    var summaryDiv = document.createElement("div");
    summaryDiv.setAttribute("class", "summary-w");

    //create p element w/class summaryText and text of current weather conditions
    var summaryTextDiv = document.createElement("p");
    summaryTextDiv.setAttribute("class", "summaryText");
    summaryTextDiv.textContent = `${weather.WeatherText}`;

    //create div element w/class pictoBackdrop
    var pictoBackdropDiv = document.createElement("div");
    pictoBackdropDiv.setAttribute("class", "pictoBackdrop");

    //create div element w/class pictoFrame
    var pictoFrameDiv = document.createElement("div");
    pictoFrameDiv.setAttribute("class", "pictoFrame");

    //create img element with icon and name of weather text and class weather-icon
    //if number returned is < 0, turnary operator to add 0 before number value
    //sometimes object returns single digit when two digits are always needed
    var icon = document.createElement("img");
    var num =  `0${weather.WeatherIcon}`;
    icon.setAttribute("src", `https://developer.accuweather.com/sites/default/files/${(weather.WeatherIcon < 10? num : weather.WeatherIcon)}-s.png`);
    icon.setAttribute("alt", weather.WeatherText);
    icon.setAttribute("class", "weather-icon");

    //create p element with text city, state example: los angeles, california
    var cityStateDiv = document.createElement("div");
    cityStateDiv.textContent = `${userLocation.city}, ${userLocation.state}`;
    cityStateDiv.setAttribute("class", "city-div");

    //create div element wclass state-div and text of state
    var wStateDiv = document.createElement("div");
    wStateDiv.setAttribute("class", "state-div");
    wStateDiv.textContent = `${userLocation.state}`;
    
    //append to display info how it will look on page
    detailsDiv.append(wTemperatureDiv, summaryDiv, cityStateDiv);

    summaryDiv.appendChild(summaryTextDiv);
    
    pictoFrameDiv.appendChild(icon);

    widgetDiv.append(pictoBackdropDiv, pictoFrameDiv, detailsDiv);

    containerDiv.appendChild(widgetDiv);

    //lastly append container to weather results div that lives in html
    weatherResultsDiv.appendChild(containerDiv);
}

// get current conditions, pass in data[0].key from locationCode(). Rename to weatherLocKey
function getWeatherConditions(weatherLocKey){
    fetch(`http://dataservice.accuweather.com/currentconditions/v1/${weatherLocKey}?apikey=${keys.weather}`)
    .then(res => res.json())
    .then(data => {
        //call function from above and pass in data[0]
        weatherDiv(data[0])
    })
    //Errors from ajax/api call will console log and also display "Opps!" message to page for user
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
document.addEventListener("click", function(event){
    //this IF happens when any element w/Id search-btn is clicked
    if (event.target.id === "search-btn") {
        //Prevents page from reloading
        event.preventDefault();
        //clearing the search Div
        searchDiv.textContent = "";

        //getting elements to hook onto
        var actInput =  document.getElementById("activities");
        var zipInput = document.getElementById("zip");

        //get values from form (zipcode & activity) and push to object?
        userQuery = actInput.value;
        userLocation.zip = zipInput.value;
        //remove whitespace from user zip input box
        userLocation.zip.trim();

        //runs only if zip code is entered  
        if(userLocation.zip.length > 0){
            //runs function, get location key from user zipcode
            locationCode();
        }
        // reset the zip inputbox values empty 
        //Reset dropdown to food activity 
        actInput.value = "food";
    }
})

