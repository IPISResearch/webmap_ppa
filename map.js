// Create map and ui and
var map = L.map('map').setView([1.03, 29.13], 10).setMinZoom(9);
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
    return L.circleMarker(latlng, style_mines(feature));
  },
  onEachFeature: onEachFeature_mines
}).addTo(map);

// Add titres
var layer_titres = new L.GeoJSON.AJAX('data/titres_2016_mambasa.geojson',{
  style: style_titres,
  onEachFeature: onEachFeature_titres
}).addTo(map);

// Color functions
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
function style_mines(feature) {
  return {
    pane: 'mines',
    radius: (10 - 4) / (200 - 0) * (feature.properties.workers_numb - 0) + 4, //
    weight: 1,
    color: "#ffffff",
    opacity: 0.5,
    fillColor: color_mines(),
    fillOpacity: 1
  }
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

// Define popups and tooltips
function onEachFeature_mines(feature, layer) {
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
    "<tr><th>Présence des FARDC</th><td>" + feature.properties.actor_fardc + "</td></tr>" +
    "<tr><th class='notbold'>&nbsp;&nbsp;Frequence</th><td>" + feature.properties.actor_fardc_freq + "</td></tr>" +
    "<tr><th class='notbold'>&nbsp;&nbsp;Interférences</th><td>" + feature.properties.actor_fardc_interferences + "</td></tr>" +
    "<tr><th>Présence d'autres groupes armées</th><td>" + feature.properties.actor_nonfardc + "</td></tr>" +
    "<tr><th class='notbold'>&nbsp;&nbsp;Frequence</th><td>" + feature.properties.actor_nonfardc_freq + "</td></tr>" +
    "<tr><th class='notbold bottomline'>&nbsp;&nbsp;Interférences</th><td class='bottomline'>" + feature.properties.actor_nonfardc_interferences + "</td></tr>" +
    // "<tr><th>Protections</th><td>" + feature.properties.protection + "</td></tr>" +
    "<tr><th>Femmes enceintes</th><td>" + feature.properties.womenpregnant + "</td></tr>" +
    "<tr><th>Structures sanitaires séparées</th><td>" + feature.properties.womensani + "</td></tr>" +
    "<tr><th>Accidents dans les 3 mois passés</th><td>" + feature.properties.accidents + "</td></tr>" +
    "<tr><th class='notbold'>&nbsp;&nbsp;Causes</th><td>" + feature.properties.accidentcauses + "</td></tr>" +
    "<tr><th>Travail d'enfants</th><td>" + feature.properties.childunder15 + "</td></tr>" +
    "<tr><th class='notbold'>&nbsp;&nbsp;Types de travail</th><td>" + feature.properties.childunder15work + "</td></tr>" +
    "<tr><th>Utilisation de mercure sur le site </th><td>" + feature.properties.mercury + "</td></tr>" +
    "<tbody></table>",
    {maxWidth : 500}
  );
  layer.bindTooltip(feature.properties.name_site + (feature.properties.name != feature.properties.name_site ? " - " + feature.properties.name : ""));
}
function onEachFeature_titres(feature, layer) {
  layer.bindTooltip((feature.properties.group != "ZEA" ? feature.properties.group + " - " : "") + feature.properties.name, {direction: 'center', permanent: true, pane: 'titres', className: 'leaflet-tooltip-titres'});
}

// Add legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'legend');
  var divcontent = L.DomUtil.create('div', 'info');

  divcontent.innerHTML += '<h4> Légende </h4>';
  divcontent.innerHTML += '<div class="legendgroup">Mines</div>'
  for (var i = 0; i < legend.properties.categories.length; i++) {
    divcontent.innerHTML += '<i class="circle" style="background:' + color_mines(legend.properties.categories[i]) + '"></i> ' +  legend.properties.labels[i] + '<br>';
  }
  divcontent.innerHTML += '<div class="legendgroup">Titres miniers</div>'
  divcontent.innerHTML += '<i class="box" style="background:#89bac3"></i> Permis de recherche<br>'
  divcontent.innerHTML += '<i class="box" style="background:#9abf83"></i> Permis d&apos;exploitation<br>'
  divcontent.innerHTML += '<i class="box" style="background:#c3b0bf"></i> Zone d&apos;exploitation artisanale<br>'
  divcontent.innerHTML += '<i class="box" style="background:#d88289"></i> Zone interdites<br>'
  divcontent.innerHTML += '<div class="legendgroup">Autres</div>'
  divcontent.innerHTML += '<i class="box" style="background:#acdc5d"></i> Parc ou réserve'
  div.appendChild(divcontent);

  return div;
};

// Add interactivity
[
  {id: 0, name: "Toutes les mines", color_function: color_mines_default, categories: ['Oui'], labels: ["Mine"]},
  {id: 1, name: "Traitement au mercure", column: "mercury", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Traitement au mercure", "Pas de traitement au mercure"]},
  {id: 2, name: "Présence de services d'état", column: "state_presence", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Présence de services d'état", "Pas de présence de services d'état"]},
  {id: 3, name: "Présence de groupes armées", column: "actor_presence", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Présence de groupes armées", "Pas de présence de groupes armées"]},
  {id: 4, name: "Femmes enceintes", column: "womenpregnant", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Femmes enceintes", "Pas de femmes enceintes"]},
  {id: 5, name: "Accidents récents", column: "accidents", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Accidents récents", "Pas d'accidents récents"]},
  {id: 6, name: "Travail d'enfants", column: "childunder15", color_function: color_ouinon, categories: ['Oui', 'Non'], labels: ["Travail d'enfants", "Pas de travail d'enfants"]}
].forEach(function(properties) {
  var link = document.createElement('a');
      link.href = '#';
      link.id = properties.id;
      link.className = '';
      link.innerHTML = properties.name;

  link.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      for (var i = 0; i < menu.children.length; i++) {
        menu.children[i].className = '';
      }
      this.className = 'active';
      color_mines = properties.color_function;

      layer_mines.eachLayer(function(featureInstanceLayer) {
        featureInstanceLayer.setStyle({
          fillColor : color_mines(featureInstanceLayer.feature.properties[properties.column])
        });
      });

      legend.properties = properties;
      legend.remove();
      legend.addTo(map);
    }

  menu.appendChild(link);
});
document.getElementById("0").click()

// Add infobox
var infobox = L.control({position: 'bottomleft'});

infobox.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'infobox');
  var divcontent = L.DomUtil.create('div', 'info');

  divcontent.innerHTML += '<h4> Sites miniers aurifères à Mambasa, RDC </h4>';
  divcontent.innerHTML += '<img src="img/ipislogo.png" alt="IPIS Logo" align="right" style="width:50px">'
  divcontent.innerHTML += '<p>Cliquez sur une mine pour découvrir ces characteristiques. Cliquez sur les options dans le coin supérieur droit pour afficer les mines concernées.</p>'
  divcontent.innerHTML += '<p>Cette carte interactive accompagne le <a href="http://ipisresearch.be">rapport</a> du projet pilote de monitoring de l&apos;or artisanal de Mambasa, Ituri, RDC. Ce pilote a été financé par le <a href="http://www.resolv.org/site-ppa/">PPA</a> et effectuer par <a href="http://ipisresearch.be">IPIS</a> en Juin 2017, après une collecte de données de Janvier 2017 à Juin 2017.</p>'
  divcontent.innerHTML += '<div class="credits">Rapport: Guillaume de Brier, Hans Merket. Cartographie: Manuel Claeys Bouuaert. Sources: IPIS, <a href="http://portals.flexicadastre.com/drc/en/">CAMI</a> (titres miniers). Contact: <a href="mailto:mapping@ipisresearch.be">mapping@ipisresearch.be</a></div>';
  div.appendChild(divcontent);

  return div;
};
infobox.addTo(map);

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
