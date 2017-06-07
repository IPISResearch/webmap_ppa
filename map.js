// Create map and ui and
var map = L.map('map').setView([1.03, 29.13], 10).setMinZoom(8);
var menu = document.getElementById('menu-ui');

// Specifying access tokens
var mapboxAccessToken = "pk.eyJ1IjoiaXBpc3Jlc2VhcmNoIiwiYSI6IklBazVQTWcifQ.K13FKWN_xlKPJFj9XjkmbQ";

// Add base layer
var group_base = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: mapboxAccessToken
}).addTo(map);

// Create panes
map.createPane("mines").style.zIndex = 450;
map.createPane("titres").style.zIndex = 250;

// Add points
var layer_mines = new L.GeoJSON.AJAX('data/data_map.geojson', {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, style_mines);
  },
  onEachFeature: onEachFeature_mines
}).addTo(map);

// Add titres
var layer_titres = new L.GeoJSON.AJAX('data/titres_2016_mambasa.geojson',{
  style: style_titres
}).addTo(map);

// Color function
function color_titres(group) {
  return group == 'PR' ? '#43b7ff' :
  group == 'PE' ? '#36ae71' :
  group == 'ZEA' ? '#9f2bae' :
  group == 'ZIN' ? '#ae000e' :
  '#ffffff';
}
function color_yesno(bool) {
  return bool ? '#a8657b' : '#ef9e30';
}
function color_minetypes(value) {
  return value == 'Alluvionaire' ? '#43b7ff' :
  value == 'Eluvionaire' ? '#ae000e' :
  '#ffffff';
}
function color_mines_default(value) {
  return '#788292';
}
var color_mines = color_mines_default;

// Style points
var style_mines = {
  pane: 'mines',
  radius: 5,
  weight: 1,
  color: "#ffffff",
  opacity: 0.5,
  fillColor: color_mines(),
  fillOpacity: 1
};

// Style titres
function style_titres(feature) {
  return {
    fillColor: color_titres(feature.properties.group),
    weight: 1,
    opacity: 0.3,
    color: 'white',
    fillOpacity: 0.1
  };
}

//   // Highlights
//   function highlight_mine(e) {
//     var layer = e.target;
//
//     layer.setStyle({
//         weight: 4,
//         color: '#ffffff'
//       });
//
//     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
//         layer.bringToFront();
//     }
// }
// function resetHighlight(e) {
//     layer_mines.resetStyle(e.target);
// }

// Define popups and tooltips
function translate(value){
  return value == 1 ? 'Oui' :
  value == "1" ? 'Oui' :
  value == 0 ? 'Non' :
  value == "0" ? 'Non' :
  value;
}
function onEachFeature_mines(feature, layer) {
  // Popup if feature has the desired content
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(
      "<b>Site name:</b> " + feature.properties.name + "<br>" +
      "<b>Longitude:</b> " + Math.round(feature.properties.longitude * 1000) / 1000 + "<br>" +
      "<b>Latitude:</b> " + Math.round(feature.properties.latitude * 1000) / 1000 + "<br>" +
      "<b>Mine alluvionaire:</b> " + translate(feature.properties.exploitation_alluvionaire) + "<br>"
    );
    layer.bindTooltip("<b>Site:</b> " + feature.properties.name);
  }
}

// Add layer control
// L.control.layers(null, {"Mining concessions": group_titres}).addTo(map);

// Add interactivity
[
  {name: "All mines", color_function: color_mines_default},
  {name: "Armed groups", column: "name", color_function: color_yesno, categories: [1, 0], labels: ['Yes', 'No']},
  {name: "Alluvionaire", column: "exploitation_alluvionaire", color_function: color_yesno, categories: [1, 0], labels: ['Yes', 'No']},
  {name: "Services", column: "name", color_function: color_yesno, categories: [1, 0], labels: ['Yes', 'No']}
].forEach(function(properties) {
  var link = document.createElement('a');
      link.href = '#';
      link.className = 'active';
      link.innerHTML = properties.name;

  link.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      color_mines = properties.color_function;

      layer_mines.eachLayer(function(featureInstanceLayer) {
        featureInstanceLayer.setStyle({
          fillColor : color_mines(featureInstanceLayer.feature.properties[properties.column])
        });
      });

      legend.properties = properties;
      legend.remove();
      if(properties.name != "All mines") {
        legend.addTo(map);
      }
  };

  menu.appendChild(link);
});

// Add search layer
var searchControl = new L.Control.Search({
  layer: layer_mines,
  propertyName: 'name',
  marker: false,
  moveToLocation: function(latlng, title, map) {
    map.setView(latlng, 12);
  }
});
searchControl.on('search:locationfound', function(e) {
  if(e.layer._popup) e.layer.openPopup();
});
map.addControl( searchControl );  //inizialize search control

// Add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'legend');
  var divcontent = L.DomUtil.create('div', 'info');

  divcontent.innerHTML += '<h4> Legend </h4>';
  for (var i = 0; i < legend.properties.categories.length; i++) {
    divcontent.innerHTML +=
    '<i class="circle" style="background:' + color_mines(legend.properties.categories[i]) + '"></i> ' +
    legend.properties.labels[i] + (i < (legend.properties.categories.length - 1) ? '<br>' : '');
  }
  div.appendChild(divcontent);

  return div;
};
