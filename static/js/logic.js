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
  id: "mapbox.light",
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
  
   console.log(e.sourceTarget.feature.properties.NAME);
   addState(e.sourceTarget.feature.properties.NAME)
   DrawPieChart(e.sourceTarget.feature.properties.NAME);
   DrawLineChart(e.sourceTarget.feature.properties.NAME);
   }
  
  
   //Feed in the state from the geojyson file to return state graph values
   function addState(stateN){
     console.log(stateN)
      return stateN;
    
    };


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
      
}
 
}).addTo(myMap);

// Add a legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];
  // Add min & max
  var legendInfo = "<h2>Census Area</h2>" 
    // "<div class=\"labels\">" +
    //   "<div class=\"min\">" + limits[0] + "</div>" +
    //   "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    // "</div>";
  div.innerHTML = legendInfo;
  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};
// Adding legend to the map
legend.addTo(myMap);


});



function DrawPieChart(id) {
  
  console.log("DrawPieChart Started")

  d3.json("/data/state").then(function(data) {
  // filter samples by id 
  // console.log(id)

  var newState = data.filter((x)=>x.NAME === id);
  //var newState = data.filter((x)=>x.state === id);
  // console.log(newState)
  newState.forEach(function(d) {
    d.beds = +d.beds;
    d.county_count = +d.county_count;
    // console.log(d.county_count) 
  });

  //keys = Object.keys(data);
  //keys = newState.map(function(d) { return d.State_Abbr; }); 
  keys = ["Beds", "County Count"]
  values1 = [newState.map(function(d) { return d.beds;})];
  // console.log(values1)
  values2 = values1[0]
  values3 = [newState.map(function(d) { return d.county_count;})];
  values4 = values3[0]


  
      // create trace0 Data  for bar chart for one state
  var trace7 = [{
      values : [values2[0], values4[0]],
      //values : [[newState.map(function(d) { return d.beds;})], 25],
      //values : [500,d.county_count],
      labels : keys,
      //  x: keys,
      //  y: values,
       // text: labels,
        
      type:"pie",
      orientation: "v",
  }];

    var data7 = [trace7];


// Define a layout object
  var layout = {
      title: "Number of counties VS icu beds",
      
      width: 400,
      height: 300,
      
    };  
    Plotly.newPlot("Piechart", trace7, layout);



  });
}  //End Function DrawPieChart





// draw line chart
function DrawLineChart(id) {

  console.log("DrawLineChart Started")

  // d3.json("/data/cases").then(function(data) {


    // Define SVG area dimensions
var svgWidth = 400;
var svgHeight = 300;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
// var svg = d3.select("#lineGraph");
// svg.selectAll("*").remove();

var svg = d3.select("#lineGraph")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Configure a parseTime function which will return a new Date object from a string
var parseTime = d3.timeParse("%M");

// Load data from forcepoints.csv
d3.json("/data/cases").then(function(forceData) {

  // Print the forceData
  console.log(forceData);

  // Format the date and cast the force value to a number
  var newState = forceData.filter((x)=>x.state === id);
  newState.forEach(function(data) {
    data.month = parseTime(data.month);
    data.confirmed = +data.confirmed;
  });

  // Configure a time scale
  // d3.extent returns the an array containing the min and max values for the property specified
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(newState, data => data.month))
    .range([0, chartWidth]);

  // Configure a linear scale with a range between the chartHeight and 0
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newState, data => data.confirmed)])
    .range([chartHeight, 0]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xTimeScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Configure a line function which will plot the x and y coordinates using our scales
  var drawLine = d3.line()
    .x(data => xTimeScale(data.month))
    .y(data => yLinearScale(data.confirmed));

  // Append an SVG path and plot its points using the line function
  chartGroup.append("path")
    // The drawLine function returns the instructions for creating the line for forceData
    .attr("d", drawLine(newState))
    .classed("line", true);

  // Append an SVG group element to the chartGroup, create the left axis inside of it
  chartGroup.append("g")
    .classed("axis", true)
    .call(leftAxis);

  // Append an SVG group element to the chartGroup, create the bottom axis inside of it
  // Translate the bottom axis to the bottom of the page
  chartGroup.append("g")
    .classed("axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
}).catch(function(error) {
  console.log(error);
});



  // filter samples by id 
  // console.log(id)
////////////////////////////////////
//   var newState = data.filter((x)=>x.state === id);
//   var parsedate = d3.timeFormat('%H:%M:%S %L'); 

//   var newState = data.filter((x)=>x.state === id);
//   // console.log("test test"+newState)
//   newState.forEach(function(d) {
//     d.month = +d.month;
//     d.confirmed = +d.confirmed;
//     d.deaths = +d.deaths;
//     d.recovered = +d.recovered;
//   });
 

//   //keys = Object.keys(data);
//   //keys = newState.map(function(d) { return d.State_Abbr; }); 
//   keys = ["months in 2020", "confirmed"]
//   values1 = [newState.map(function(d) { return d.confirmed;})];
//   // confirmedo= values1[0]
//   values2 = [newState.map(function(d) { return d.month;})];
//   // montho = values2[0]
//   values3 = [newState.map(function(d) { return d.deaths;})];
//   // values6 = values3[0]
//   values4 = [newState.map(function(d) { return d.recovered;})];
//   console.log("months"+[values2])
//   console.log("confirmed"+[values1])

  
//       // create trace0 Data  for bar chart for one state
//   var trace = {
//       // values : [values5[0], values5[0]],
       
//        x: ["Jan","Feb","Mar"],
//        y: [values1],
//       //  y: [1,2,3],
//       //  // text: labels
//       //  labels : keys,
        
//       type:"scatter",
//       // orientation: "h",
//   };

    
//   var data = [trace];

// // Define a layout object
//   var layout = {
//       title: "covid 19 confirmed case",
      
//       width: 500,
//       height: 300,
      
//     };  
// Plotly.newPlot("lineGraph", data);

//////////////////////////////

  // });
}  //End Function DrawLineChart



function init() {
  // select dropdown menu 
  //var dropdown = d3.select("#selDataset");
  var Initial_State = "Minnesota"

  DrawPieChart(Initial_State);

  DrawLineChart(Initial_State);
  
}


init();