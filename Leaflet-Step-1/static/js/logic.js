// main file to plot the geo map
// url for weekly earthquake data
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Initializing earthquake layer
const earthquakeLayer = new L.LayerGroup();

// setting up default gray scale map
const grayScaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// we will show only grey scale for now
const baseMaps = {
  GreyScale: grayScaleMap,
};

// only marker's overlay will be available now
var overlayMaps = {
  EarthquakeLayer: earthquakeLayer
};

// Create map object and set default layers
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [grayScaleMap, earthquakeLayer]
});

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
