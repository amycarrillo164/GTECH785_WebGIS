
var map = L.map('mapid').setView([40.74, -74.0], 13);
var tiles = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=6m6XL7auRpA54aXzF9eM5hXkLcp2k1omEJRPH5Ml2Jh6uVCy6OkdOQUyHgOvt2qO', {
    maxzoom:19,
    }).addTo(map);

    map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors");

L.geoJSON(popData).addTo(map);


// Creating a pop-up with Lat/Long details 

// var popup = L.popup();

// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent("You clicked the map at " + e.latlng.toString())
//         .openOn(map);
// }

// map.on('click', onMapClick);


// Style

function getColor(d) {
    return d > 1500 ? '#0868ac' :
           d > 1250  ? '#43a2ca' :
           d > 1000  ? '#7bccc4' :
           d > 500  ? '#a8ddb5' :
           d > 250   ? '#ccebc5' :
           d > 0    ? '#f0f9e8':
                      '#000000';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.TotalPop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(popData, {style: style}).addTo(map);

//Adding interactive layer

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties)
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


var geojson;
geojson = L.geoJson();


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(popData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


//custom control
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.TotalPop + ' people / mi<sup>2</sup>'
        : 'Hover over a Block');
};

info.addTo(map);

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 250, 500, 1000, 1250, 1500],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);