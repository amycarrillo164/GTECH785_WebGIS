function style_feature_SLR10(feature) {
    return {
        fillColor: '#5fbaff',
        weight: 2,
        opacity: 0.8,
        //color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function style_feature_SLR1(feature) {
    return {
        fillColor: '#003c6a',
        weight: 2,
        opacity: 0.5,
        //color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Layers
var SLR3_10pct = L.geoJSON(SLR3_10, {style: style_feature_SLR10,});
var SLR3_1pct = L.geoJSON(SLR3_1, {style: style_feature_SLR1,});

//Layer Groups
var SLR3_10pcts = L.layerGroup([SLR3_10pct]);
var SLR3_1pcts = L.layerGroup([SLR3_1pct]);

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var map = L.map('mapid', {layers: [googleSat, SLR3_10pcts, SLR3_1pcts], center: [42.3131628, -70.9297749], zoom: 12});

//Layer box
var baseMaps = {
    "Google Earth Satellite": googleSat,
};
var overlayMaps = {
    "SLR 36in + 10% AEP" : SLR3_10pcts,
    "SLR 36in + 1% AEP" : SLR3_1pcts,
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);




