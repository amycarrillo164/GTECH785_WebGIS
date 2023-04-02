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
var SLR2_10pct = L.geoJSON(SLR2_10, {style: style_feature_SLR10,});
var SLR2_1pct = L.geoJSON(SLR2_1, {style: style_feature_SLR1,});

//Layer Groups
var SLR2_10pcts = L.layerGroup([SLR2_10pct]);
var SLR2_1pcts = L.layerGroup([SLR2_1pct]);

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var map = L.map('mapid', {layers: [googleSat, SLR2_10pcts, SLR2_1pcts], center: [42.3131628, -70.9297749], zoom: 12});

//Layer box
var baseMaps = {
    "Google Earth Satellite": googleSat,
};
var overlayMaps = {
    "SLR 22in + 10% AEP" : SLR2_10pcts,
    "SLR 22in + 1% AEP" : SLR2_1pcts,
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);




