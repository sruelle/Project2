// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [38.30, -98.00],
    zoom: 4
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  // L.tileLayer("https://api.mapbox.com/styles/v1/mauma/ck8y47lqu03m31it4vnm9v7d9.html?fresh=true&title=copy&access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Uncomment this link local geojson for when data.beta.nyc is down
  var link = "static/data/usstates.geojson";
  
  // Grabbing our GeoJSON data..
  d3.json(link, function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data).addTo(myMap);
  });
  
  // Load in geojson data
  var geoData = "static/data/usstates.geojson";
  var stateData="/data/state";
  
  // Define a dictionary to hold key-value pairs,
  // where the key is the state name and the value is
  // the number of ICU beds in that state. 
  var icuBedsLookup = {};
  
  
  // Define a function that populates the dictionary 
  // of ICU beds. This function should be called once
  // when the page loads. 
  function countIcuBeds() {
    d3.json(stateData).then((data) => {
  
      data.forEach((state) => {
        if (!(state.NAME in icuBedsLookup)) {
          icuBedsLookup[state.NAME] = state.beds;
        }
      }); 
  
      // console.log(icuBedsLookup); 
    }); 
  }
  // Populate the dictionary of ICU beds 
  countIcuBeds();
  
  
  // Define a function that populates the dictionary 
  // of population. This function should be called once
  // when the page loads.
  var populationLookup = {};
  
  function countpopulation() {
    d3.json(stateData).then((data) => {
  
      data.forEach((state) => {
        if (!(state.NAME in populationLookup)) {
          populationLookup[state.NAME] = state.Population;
        }
      }); 
  
      // console.log(populationLookup); 
    }); 
  }
  // Populate the dictionary of ICU beds 
  countpopulation();
  
    //  create a function that will return state name from geogyson file
    function myFunction(e) {
    //  console.log(e.sourceTarget.feature.properties.NAME);
     addState(e.sourceTarget.feature.properties.NAME)
     
     }
    
    
     //Feed in the state from the geojyson file to return state graph values
     function addState(stateN){
       console.log(stateN)
      d3.json(stateData).then(function(sdata) {
        // Loop through data
      for (var i = 0; i < sdata.length; i++) {
        var location = sdata[i].state;
        // console.log(location)
      
      if (sdata[i].state == stateN){
      console.log(stateN)
      //now make pie chart
      
      }
       };
      
        }
      )};
  
  
  var geojson;
  
  // Grab data with d3
  d3.json(geoData).then((data) => {
  // console.log(data);
  
    // Create a new choropleth layer
    geojson = L.choropleth(data, {
  
      // Define what  property in the features to use
      valueProperty: "CENSUSAREA",
  
      // Set color scale
      // scale: ["#ffffb2", "#b10026"],
  
      // Number of breaks in step range
      steps: 10,
  
      // q for quartile, e for equidistant, k for k-means
      mode: "q",
      style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
      },
       
      // Binding a pop-up to each layer
      onEachFeature: function(feature, layer) {    
        // console.log(feature.properties.NAME);
        layer.on({click:myFunction})
  
        // Use the state name to lookup the number of ICU beds - DOM
        var numBeds = icuBedsLookup[feature.properties.NAME]; 
        var numPop = populationLookup[feature.properties.NAME]; 
        layer.bindPopup("State: " + feature.properties.NAME + "<br>Population: "
          + numPop + "<br>ICU Beds: " + numBeds); 
  
   
  }}).addTo(myMap);
  
    
  });
  
  
  