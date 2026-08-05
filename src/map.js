var map = L.map('map').setView([48.802255, 16.96000], 15); // Hrušky

//Logo
var logo = L.control({ position: 'topleft' });
logo.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info');
    div.innerHTML = '<img src="./src/NB_horizontalni_Black.svg" alt="Logo" size="50" style="width: 150px; height: auto; margin: 5px;"/>';
    return div;
};
logo.addTo(map);

// Ovládací prvky mapy
map.attributionControl._attributions = {};
map.attributionControl.setPrefix();
map.zoomControl.setPosition('topleft');
L.control.scale({ imperial: false, maxwidth: 200 }).addTo(map);

// Podkladová vrstva
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var orthoLayer = L.tileLayer('https://ags.cuzk.gov.cz/arcgis1/rest/services/ORTOFOTO_WM/MapServer/WMTS/tile/1.0.0/ORTOFOTO_WM/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK Orthophoto</a>',
    maxZoom: 22
}).addTo(map);

var kmGridLayer = L.tileLayer('https://services.cuzk.cz/wmts/local-km-wmts-google.asp/WMTS/tile/1.0.0/local-km/default/GoogleMapsCompatible/{z}/{y}/{x}.png', {
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK Kilometric Grid</a>',
    maxZoom: 20
});

var eagriOLNej = L.tileLayer.wms("https://mze.gov.cz/public/app/wms/plpis.fcgi", {
    layers: 'ODTOKLINIE_NEJ_V8',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://eagri.cz">eAGRI</a>',
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    tiled: true
});

var eagriOL = L.tileLayer.wms("https://mze.gov.cz/public/app/wms/plpis.fcgi", {
    layers: 'ODTOKLINIE_V2',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://eagri.cz">eAGRI</a>',
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    tiled: true
});

var eagriDPBuc = L.tileLayer.wms("https://mze.gov.cz/public/app/wms/public_DPB_PB_OPV.fcgi", {
    layers: 'DPB_UCINNE',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://eagri.cz">eAGRI</a>',
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    tiled: true
});

var eagriDPBuziv = L.tileLayer.wms("https://mze.gov.cz/public/app/wms/public_DPB_PB_OPV.fcgi", {
    layers: 'DPB_UZIV',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://eagri.cz">eAGRI</a>',
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    tiled: true
});

var eagriLPISVym = L.tileLayer.wms("https://mze.gov.cz/public/app/wms/plpis.fcgi", {
    layers: 'LPIS_FB_VYMERA_TISK',
    format: 'image/png',
    transparent: true,
    attribution: '&copy; <a href="http://eagri.cz">eAGRI</a>',
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    tiled: true
});

var zabagedSraz = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis/services/ZABAGED_POLOHOPIS/MapServer/WmsServer", {
    layers: '47',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK</a>',
    tiled: true
});


// funkce pro načtení geojson souboru
function loadGeoJSON(url, layer) {
    fetch(url)
        .then(response => response.json())
        .then(data => layer.addData(data))
        .catch(error => console.error(`Error loading ${url}:`, error));
}

// funkce pro načtení barvy parcely podle atributu
function getColor(property) {
    return property == 2 ? '#cc7d0f' :
        property == 4 ? '#c3e332' :
            property == 5 ? '#9fe8ba' :
                property == 6 ? '#89eae8' :
                    property == 7 ? '#90ce45' :
                        property == 10 ? '#068246' :
                            property == 11 ? '#66a3c9' :
                                property == 13 ? '#a5aaa8' :
                                    property == 14 ? '#d0b7c7' :
                                        '#ffffff';
};

// Vytvoření geoJSON vrstvy pro parcely podle druhu pozemku (bez dat)
/*
var parcelyDP = L.geoJSON(null, {
    style: function (feature) {
        return {
            fillColor: getColor(feature.properties.DruhPozemkuKod),
            color: 'black',
            weight: 0.6,
            fillOpacity: 0.4,
        };
    },
    onEachFeature: function (feature, layer) {
        // Add popup on hover
        layer.on('mouseover', function (e) {
            layer.bindTooltip("<b>Číslo parcely: </b> " + feature.properties.KmenoveCislo + (feature.properties.PododdeleniCisla ? "/" + feature.properties.PododdeleniCisla : "")).openTooltip();
            e.target.setStyle({
                weight: 3, 
                color: '#000000'
            });
            e.target.bringToFront();
        });

        // Reset style on mouseout
        layer.on('mouseout', function (e) {
            parcelyDP.resetStyle(e.target);
        });
    }
});
*/

// Vytvoření geoJSON vrstvy pro katastrální území
var ku = L.geoJSON(null, {
    style: function (feature) {
        return {
            fillColor: '#0AFFF5',
            color: '#0AFFF5',
            weight: 1,
            fillOpacity: 0,
        };
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.Nazev) {
            layer.bindTooltip(feature.properties.Nazev, {
                permanent: true,
                direction: 'center',
                className: 'katastralni-label'
            });
        }
    }
}).addTo(map);

// Vytvoření geoJSON vrstvy pro vybranou parcelu
var parcela = L.geoJSON(null, {
    style: function (feature) {
        return {
            fillColor: '#0AFFF5',
            color: '#0AFFF5',
            weight: 1,
            fillOpacity: 0.2,
        };
    },
    onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.Nazev) {
            layer.bindTooltip(feature.properties.Nazev, {
                permanent: true,
                direction: 'center',
                className: 'katastralni-label'
            });
        }
    }
}).addTo(map);

/*
// Vytvoření geoJSON vrstvy pro parcely podle navržených opatření (bez dat)
var parcelyNavrhOpatreni = L.geoJSON(null, {
    style: function (feature) {
        return {
            fillColor: getColorNavrzenaOpatreni(feature.properties["Návrh opatření"]),
            color: 'black',
            weight: 0.2,
            fillOpacity: 0.8,
        };
    },
    onEachFeature: function (feature, layer) {
        layer.on('mouseover', function (e) {
            layer.bindTooltip(feature.properties.KmenoveCislo + (feature.properties.PododdeleniCisla ? "/" + feature.properties.PododdeleniCisla : "")).openTooltip();
            e.target.setStyle({
                weight: 3,
                color: hoverColor
            });
            e.target.bringToFront();
        });

        layer.on('mouseout', function (e) {
            parcelyNavrhOpatreni.resetStyle(e.target);  // This resets it to the default defined in `style:`
        });
    }
}).addTo(map);
*/

//loadGeoJSON('https://raw.githubusercontent.com/DajanaSnopkova/mapa-mkrumlov/main/data/parcely_Krumlov.geojson', parcelyDP);
loadGeoJSON('https://raw.githubusercontent.com/DajanaSnopkova/mapa-mkrumlov/main/data/ku.geojson', ku);
loadGeoJSON('https://raw.githubusercontent.com/DajanaSnopkova/mapa-mkrumlov/main/data/parcela.geojson', parcela);

// Přepínač vrstev
var baseMaps = {
    "OpenStreetMaps": osmLayer,
    "Ortofoto": orthoLayer
};

/*
var overlayMaps = {
    "Navržená opatření": parcelyNavrhOpatreni,
    "Protierozní opatření": parcelyErozniOpatreni,
    //"Parcely podle druhu pozemku": parcelyDP,
    "Eroze - odtokové linie - nejdelší kritická délka OL": eagriOLNej,
    "Eroze - odtokové linie": eagriOL,
    "DPB účinné - kód": eagriDPBucKod,
    "DPB účinné": eagriDPBuc,
    "LPIS výměra": eagriLPISVym,
    "Stupeň, sráz - ZABAGED": zabagedSraz,
    //"Katastrální mapa": kmGridLayer,
};
*/

var groupedOverlays = {
    "Podkladové vrstvy": {
        "Eroze - odtokové linie - nejdelší krit. délka": eagriOLNej,
        "Eroze - odtokové linie": eagriOL,
        "DPB účinné": eagriDPBuc,
        "DPB uživatel": eagriDPBuziv,
        "LPIS výměra": eagriLPISVym,
        "Stupeň, sráz - ZABAGED": zabagedSraz,
        "Katastrální území": ku,
        "Vybraná parcela": parcela,
    }
};

/*
//Legenda druh pozemku
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        druhyP = [2, 4, 5, 6, 7, 10, 11, 13, 14];
        druhyPlabels = ['orná půda', 'vinice', 'zahrada', 'ovocný sad', 'trvalý travní porost', 'lesní pozemek', 'vodní plocha', 'zastavěná plocha a nádvoří', 'ostatní plocha'];
    div.innerHTML += '<h4>Parcely podle druhu pozemku</h4>';
    for (var i = 0; i < druhyP.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(druhyP[i]) + '"></i> ' +
            (druhyPlabels[i]) + '<br>';
    }
    return div;
};


//Legenda navržená opatření
var legendNavrhOpatreni = L.control({position: 'bottomright'});
legendNavrhOpatreni.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        druhyNO = ['PC', 'VL', 'BK', 'BC', 'RL', 'DR', 'NULL', 'SM'];
        druhyNOlabels = ['polní cesta', 'větrolam', 'biokoridor', 'biocentrum', 'rozvojová plocha', 'územní rezerva',  'neposuzovaná plocha', 'směna ZPF (návrh)'];
    div.innerHTML += '<h4>Navržená opatření</h4>';
    for (var i = 0; i < druhyNO.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColorNavrzenaOpatreni(druhyNO[i]) + '"></i> ' +
            (druhyNOlabels[i]) + '<br>';
    }
    return div;
};

legendNavrhOpatreni.addTo(map);
*/

// Zobrazit legendu, pokud je aktivní vrstva
function toggleLegend(layerName, legendName) {
    if (map.hasLayer(layerName)) {
        legendName.addTo(map);
    } else {
        map.removeControl(legendName);
    }
};

// Přidání legendy do mapy
/*
parcelyDP.on('add', function () { toggleLegend(parcelyDP, legend); });
parcelyDP.on('remove', function () { toggleLegend(parcelyDP, legend); });

parcelyNavrhOpatreni.on('add', function () { toggleLegend(parcelyNavrhOpatreni, legendNavrhOpatreni); });
parcelyNavrhOpatreni.on('remove', function () { toggleLegend(parcelyNavrhOpatreni, legendNavrhOpatreni); });
*/

//L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
L.control.groupedLayers(baseMaps, groupedOverlays, { collapsed: false, collapsible: true }).addTo(map);