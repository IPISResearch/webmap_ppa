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
function color_ouinon(value) {
  return value.indexOf("Oui") != -1 ? 'rgb(218, 165, 32)' : 'rgba(218, 165, 32, 0.25)';
}
function color_mines_default(value) {
  return 'rgb(218, 165, 32)';
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
function onEachFeature_mines(feature, layer) {
  // Popup if feature has the desired content
  if (feature.properties) {
    layer.bindPopup(
      "<table class='infotable'><tbody>" +
      "<tr><th>Site</th><td>" + feature.properties.name_site + "</td></tr>" +
      "<tr><th>Chantier</th><td>" + feature.properties.name + "</td></tr>" +
      "<tr><th class='bottomline'>Pcode</th><td class='bottomline'>" + feature.properties.pcode + "</td></tr>" +
      "<tr><th>Collectivite</th><td>" + feature.properties.collectivite + "</td></tr>" +
      "<tr><th>Groupement</th><td>" + feature.properties.groupement + "</td></tr>" +
      "<tr><th>Village</th><td>" + feature.properties.village + "</td></tr>" +
      // "<tr><th>Longitude</th><td>" + Math.round(feature.properties.longitude * 1000) / 1000 + "</td></tr>" +
      // "<tr><th>Latitude</th><td>" + Math.round(feature.properties.latitude * 1000) / 1000 + "</td></tr>" +
      "<tr><th class='bottomline'>Date de visite</th><td class='bottomline'>" + feature.properties.visit_date + "</td></tr>" +
      "<tr><th>Type d'exploitation</th><td>" + feature.properties.exploitation + "</td></tr>" +
      "<tr><th>Nombre de travailleurs</th><td>" + feature.properties.workers_numb + "</td></tr>" +
      "<tr><th class='bottomline'>Nombre de puits</th><td class='bottomline'>" + feature.properties.pits_numb + "</td></tr>" +
      "<tr><th>Présence du SAESSCAM</th><td>" + feature.properties.state_saesscam + "</td></tr>" +
      "<tr><th class='notbold'>&nbsp;&nbsp;Frequence</th><td>" + feature.properties.state_saesscam_freq + "</td></tr>" +
      "<tr><th>Présence de la Division des Mines</th><td>" + feature.properties.state_divmin + "</td></tr>" +
      "<tr><th class='notbold'>&nbsp;&nbsp;Frequence</th><td>" + feature.properties.state_divmin_freq + "</td></tr>" +
      "<tr><th class='bottomline'>Services d’état prélevant des taxes</th><td class='bottomline'>" + feature.properties.state_names_taxing + "</td></tr>" +
      "<tr><th>Protections</th><td>" + feature.properties.protection + "</td></tr>" +
      "<tr><th>Femmes enceintes</th><td>" + feature.properties.womenpregnant + "</td></tr>" +
      "<tr><th>Structures sanitaires séparées</th><td>" + feature.properties.womensani + "</td></tr>" +
      "<tr><th>Accidents dans les 3 mois passés</th><td>" + feature.properties.accidents + "</td></tr>" +
      "<tr><th class='notbold'>&nbsp;&nbsp;Causes</th><td>" + feature.properties.accidentcauses + "</td></tr>" +
      "<tr><th>Travaille d'enfants</th><td>" + feature.properties.childunder15 + "</td></tr>" +
      "<tr><th class='notbold'>&nbsp;&nbsp;Types de travaille</th><td>" + feature.properties.childunder15work + "</td></tr>" +
      "<tr><th>Utilisation de mercure sur le site </th><td>" + feature.properties.mercury + "</td></tr>" +
      "<tbody></table>",
      {maxWidth : 600}
    );
    layer.bindTooltip(feature.properties.name_site + (feature.properties.name != feature.properties.name_site ? " - " + feature.properties.name : ""));
  }
}

// Add layer control
// L.control.layers(null, {"Mining concessions": group_titres}).addTo(map);

// Add interactivity
[
  {name: "All mines", color_function: color_mines_default},
  {name: "Traitement au mercure", column: "mercury", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ['Oui', 'Non']},
  {name: "Services", column: "name", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ['Oui', 'Non']}
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
