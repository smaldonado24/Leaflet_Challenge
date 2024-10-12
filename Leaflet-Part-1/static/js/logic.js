  // Creating a base layer for the map.
  let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Creating a map to display.
  let myMap = L.map("map", {
    center: [40.7, -94.5],
    zoom: 4
  })

  baseMap.addTo(myMap);

// The Function for the color depths of the earthquakes.
function getColor(depth){
    if(depth > 90){
        return "#ea2c2c"
    } else if (depth > 70) {
        return "#ea822c"
    } else if (depth > 50){
        return "#ee9c00"
    } else if (depth > 30) {
        return "#eecc00"
    } else if (depth > 10) {
        return "#d4ee00"
    } else {
        return "#98ee00"
    }
}

// Creating a function to get the radious of the earthquake by its magnitude.
function getRadius(magnitude){
    if (magnitude === 0) {
        return 1
    }
    return magnitude * 3
}


// The API call to the Earthquake API to get earthquake info.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    console.log(data);

// The function to determine the marker sizes and colors. 
    function styleInfo(feature){
        return{
            stroke: true,
            fillOpacity: 1,
            opacity: 1,
            color: "#000000",
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getRadius(feature.properties.mag),
            weight: 0.7
        }
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        }, 
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }

    }).addTo(myMap);

// Add a legend to the map for identification
    let legend = L.control({
     position: "bottomright"
    });

    legend.onAdd = function(){
    let container = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];
    for(let index = 0; index < grades.length; index++) {
        container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]} &ndash; ${grades[index + 1]}<br>`
    }
    return container;
    }

    legend.addTo(myMap);
})