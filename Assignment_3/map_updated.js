
// Setting up the map
var map = L.map('mapid').setView([40.74, -74.0], 13);
var tiles = L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=6m6XL7auRpA54aXzF9eM5hXkLcp2k1omEJRPH5Ml2Jh6uVCy6OkdOQUyHgOvt2qO', {
    maxzoom:19,
    }).addTo(map);
    map.attributionControl.addAttribution("<a href=\"https://www.jawg.io\" target=\"_blank\">&copy; Jawg</a> - <a href=\"https://www.openstreetmap.org\" target=\"_blank\">&copy; OpenStreetMap</a>&nbsp;contributors");
 

//Styling the "totalpop" layer
function getColor(d) {
    return d > 3000 ? '#0868ac' :
           d > 1500  ? '#43a2ca' :
           d > 1000  ? '#7bccc4' :
           d > 500  ? '#a8ddb5' :
           d > 250   ? '#ccebc5' :
           d < 0    ? '#f0f9e8':
                      '#454545';
}

function style_feature(feature) {
    return {
        fillColor: getColor(feature.properties.TotalPop),
        weight: 2,
        opacity: 0.8,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

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
    tractPopData.resetStyle(e.target);
    info.update();
}


// Zooming into feature after selecting it
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature,
    });
}


// Calling the functions
tractPopData = L.geoJSON(popData, {
    style: style_feature,
    onEachFeature: onEachFeature,
}).addTo(map);



//Custom control for population density data
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};


// Method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.TotalPop + ' people / mi<sup>2</sup>'
        : 'Hover over a Block');
};

info.addTo(map);

//Creating min selector andd max selector
//Note: thanks Tim for your help!

const minSelector = document.getElementById('minPopulation');
const maxSelector = document.getElementById('maxPopulation');
const filterMessage = document.getElementById('filterMessage');

const hidden = {
    fillOpacity: 0,
    opacity: 0,
}

const shown = {
    fillOpacity: 0.75,
    opacity: 0.8
}

const setFilter = () => {
    let minValue = minSelector.value;
    let maxValue = maxSelector.value;
    minValue = minValue === 'null' ? null : +minValue;
    maxValue = maxValue === 'null' ? null : +maxValue;
    let message = '';

    if (maxValue === null) {
        tractPopData.getLayers().forEach(layer => {
            const totalPopulation = layer.feature.properties.TotalPop;
            const opacity = (totalPopulation >= minValue) ? shown : hidden;
            layer.setStyle(opacity);
        });

    } else if ( minValue < maxValue) {
        tractPopData.getLayers().forEach(layer => {
            const totalPopulation = layer.feature.properties.TotalPop;
            const opacity = (totalPopulation >= minValue && totalPopulation <= maxValue) ? shown : hidden;
            layer.setStyle(opacity);
        });
    } else {
        message = "Try again";
    }
    filterMessage.innerText = message;
}

minSelector.addEventListener('change', setFilter);
maxSelector.addEventListener('change', setFilter);
//


