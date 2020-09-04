
  // Create legend
  let legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);

  

function getColor(d) {
    return d > 5 ? '#F30' :
    d > 4  ? '#F60' :
    d > 3  ? '#F90' :
    d > 2  ? '#FC0' :
    d > 1   ? '#FF0' :
    '#9F3';          
  }