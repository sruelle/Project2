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
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

// Uncomment this link local geojson for when data.beta.nyc is down
var link = "static/data/usstates.geojson";


// Load in geojson data
var geoData = "static/data/usstates.geojson";
var stateData="/data/state";
var defaultState = "Minnesota"

function myFunction(e) {
  //  console.log(e.sourceTarget.feature.properties.NAME);
 addState(e.sourceTarget.feature.properties.NAME)
 //function for line graph
 }

// function printState(state){
  // console.log(state)
// }
function addState(stateN){

console.log(stateN)
d3.json(stateData).then(function(sdata) {
  // Loop through data

for (var i = 0; i < sdata.length; i++) {
  var location = sdata[i].state;
  //  console.log(location)
 // Set the data location property to a variable
if (sdata[i].state == stateN){
console.log(stateN)
//now make pie chart


}
 };
 
 

  //  console.log("State Data:" + location)

  }
)};

var geojson;


// Grab data with d3
d3.json(geoData, function(data) {
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
    layer.on({click:myFunction})
    // console.log(feature.properties.NAME)



      // layer.bindPopup("State: " + feature.properties.NAME + "<br>population:<br>" +
        // + feature.properties.CENSUSAREA);
 
}
 
}).addTo(myMap);

var dataset = {}
function init(){
  console.log("initializing dashboard");


  d3.json("/data/state").then(function(jsonData){
    dataset = jsonData;

    
    // initializeLineChart(defaultState);
    initializePieChart(defaultState);
    
  })
}});

