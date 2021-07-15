// creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom: 5
  });
  
// adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(myMap);

// USGS all earthquakes in past 7 days GeoJSON url
var usgsURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// function to set color of the markers
function setColor(mag) {
  switch (true) {
    case (mag>5):
        return "#bd0026";
    case (mag>4):
        return "#f03b20";
    case (mag>3):
        return "#fd8d3c";
    case (mag>2):
        return "#fecc5c";
    case (mag>1):
        return "#ffffb2";
    default:
        return "#bae4b3";
  }
}

// function to set markers
function setCircleMarker(feature) {
  return {
    radius: feature.properties.mag*5,
    weight: 1,
    opacity: 1,
    color: "black",
    fillOpacity: 0.8,
    fillColor: setColor(feature.properties.mag)
  };
}

// function to set popups
// onEachFeature
function equakeFeature(feature, layer) {
  layer.bindPopup(`${feature.properties.place} <br> Time: ${feature.properties.time} <br> Magnitude: ${feature.properties.mag}`);
}


// main Loop
d3.json(usgsURL).then(function(data) {

  // adding marker layer
  L.geoJSON(data.features, {
    onEachFeature: equakeFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, setCircleMarker(feature));
    }
  }).addTo(myMap);

  // create legend entries
  var legend = L.control({position: "bottomright"});
       
  legend.onAdd = function() {  
      var div = L.DomUtil.create('div', 'legend');
      labels = ["Magnitude"],
      categories = ['0-1', '1-2', '2-3', '3-4', '4-5',  '>5'],
      colors = ["#bae4b3", "#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"]

      for (var i = 0; i < categories.length; i++) {
          div.innerHTML += `${labels[0]} <hr>`
          for (var i = 0; i < categories.length; i++) {
              div.innerHTML += `<i class="lgd" style="background: ${colors[i]}"></i>${categories[i]} <br>`;
          }
      return div;
      };
  };
  legend.addTo(myMap);

});