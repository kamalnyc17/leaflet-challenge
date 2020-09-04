// URL for data source
const earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const TectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Perform initial GET request to fetch earthquake data
d3.json(earthquakeURL, (data) => createFeatures(data.features));

// Create GeoJSON layer to design the circle and popups
const createFeatures = (earthquakeData) => {
  const earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: (feature, layer) => {
      let dateOfEarthquake = new Date(feature.properties.time)
      layer.bindPopup("<h3 style='margin:2px'>" + feature.properties.place + "</h3><h5 style='margin:2px'> Magnitude: " + feature.properties.mag +
      "</h5><p style='margin:2px'>" + moment(dateOfEarthquake).format('llll') + "</p>");
    },
    pointToLayer: (feature, latlng) => {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          color: "#000",
          weight: .5,
          fillOpacity: .5,
          stroke: true
      })
    }
  });
  createMap(earthquakes)
}

// creating map layers
const createMap = (earthquakes) => {
  const satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
  const outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");
  const lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2ZlcnJhcmVuIiwiYSI6ImNqaHhvcW9sNjBlMmwzcHBkYzk0YXRsZ2cifQ.lzNNrQqp-E85khEiWhgq4Q");


  // BaseMap options
  const baseMaps = {
    "Satellite Map": satelliteMap,
    "Outdoor Map": outdoorMap,
    "Light Map": lightMap
  };

  // Tectonic plate layer
  let tectonicPlates = new L.LayerGroup();

  // Creating overlay object
  const overlayMaps = {
    Earthquakes: earthquakes,
    Tectonic_Plates: tectonicPlates
  };

  // Initializing our map
  const myMap = L.map("map", {
    center: [41.881832, -87.62317],
    zoom: 2.5,
    layers: [outdoorMap, earthquakes, tectonicPlates]
  });

   // Add Fault lines data
   d3.json(TectonicPlatesURL, (plateData) => {
     L.geoJson(plateData, {
       color: "red",
       weight: 2
     })
     .addTo(tectonicPlates);
   });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create legend
  let legend = L.control({
    position: 'bottomright'
  });
  legend.onAdd = (myMap) => {

    const div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    for (let i = 0; i < grades.length; i++) {
      let legendLine = '<i style="background-color:' + getColor(grades[i] + 1) + '; padding: 2px 20px; font-weight: bold">' +
      ' ' + grades[i] + (grades[i + 1] ? ' &ndash; ' + grades[i + 1] +  '</i><br>' : ' +');
      div.innerHTML += legendLine        
    }
    return div;
  };
  legend.addTo(myMap);
}

// legend color
const getColor = (d) => d > 5 ? '#F30' : d > 4  ? '#F60' : d > 3  ? '#F90' :
                        d > 2  ? '#FC0' : d > 1   ? '#FF0' : '#9F3'

// circle size
const getRadius = (value) => value*50000