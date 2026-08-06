var map = L.map('map').setView([48.802255, 16.96000], 14); // Hrušky

// Array to track all dynamically loaded TIFFs
var allRasterLayers = [];

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
L.control.scale({ imperial: false, maxwidth: 200, position: 'bottomright' }).addTo(map);

// Podkladová vrstva
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var orthoLayer = L.tileLayer('https://ags.cuzk.gov.cz/arcgis1/rest/services/ORTOFOTO_WM/MapServer/WMTS/tile/1.0.0/ORTOFOTO_WM/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK Orthophoto</a>',
    maxZoom: 22
}).addTo(map);

var kmGridLayer = L.tileLayer('https://services.cuzk.gov.cz/wmts/local-km-wmts-google/rest/WMTS/tile/1.0.0/local-km/default/GoogleMapsCompatible/{z}/{y}/{x}.png', {
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK</a>',
    minZoom: 17,
    maxZoom: 25
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

var hloubkaPud = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'hloubka_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var pudniTyp = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'pudni_typ_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var pudSubstrat = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'substrat_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var skeletOrnice = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'skelet_ornice_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var skeletPodornici = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'skelet_podornici_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var zrnitostOrnice = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'zrnitost_ornice_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

var zrnitostPodornici = L.tileLayer.wms("https://kpp.vumop.cz/wms/kpp.php?language=cze", {
    layers: 'zrnitost_podornici_vektor',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    crs: L.CRS.EPSG4326,
    attribution: '&copy; <a href="https://www.vumop.cz">VÚMOP, v.v.i.</a>',
    tiled: true
});

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

// Přepínač vrstev
var baseMaps = {
    "OpenStreetMaps": osmLayer,
    "Ortofoto": orthoLayer
};

var groupedOverlays = {
    "Podkladové vrstvy": {
        "Vybraná parcela": parcela,
        "Katastrální území": ku,
        "Katastrální mapa": kmGridLayer,
        "Eroze - odtokové linie - nejdelší krit. délka": eagriOLNej,
        "Eroze - odtokové linie": eagriOL,
        "Hloubka půdy": hloubkaPud,
        "Půdní typ": pudniTyp,
        "Půdnotvorný substrát": pudSubstrat,
        "Skeletovitost půdy (ornice)": skeletOrnice,
        "Skeletovitost půdy (podorničí)": skeletPodornici,
        "Zrnitost půdy (ornice)": zrnitostOrnice,
        "Zrnitost půdy (podorničí)": zrnitostPodornici,
        "DPB účinné": eagriDPBuc,
        "DPB uživatel": eagriDPBuziv,
        "LPIS výměra": eagriLPISVym,
        "Stupeň, sráz - ZABAGED": zabagedSraz
    },
    "RYPE": {}
};


// Initialize the control immediately
var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, {
    collapsed: false,
    collapsible: true,
    exclusiveGroups: ["RYPE"]
}).addTo(map);

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

// Vlastní pane pro rastry - nad WMS vrstvami (tilePane, 200), pod vektory (overlayPane, 400)
map.createPane('rasterPane');
map.getPane('rasterPane').style.zIndex = 350;
map.getPane('rasterPane').style.pointerEvents = 'none';

// GeoRasterLayer 1.4.1 volá done() synchronně uvnitř createTile(), tedy dřív než
// Leaflet dlaždici zaregistruje do _tiles. GridLayer._tileReady proto skončí hned
// na `if (!tile) return` a dlaždice nikdy nedostane příznak loaded/active.
// Důsledek: fade-in zamrzne na náhodné průhlednosti a _pruneTiles() nikdy neuklidí
// staré úrovně zoomu - na mapě zůstanou 2-3 kopie rastru přes sebe a každá si
// při zoomu animuje vlastní transform. To je to "cukání".
// Odložení done() o jeden tick vrátí dlaždice do normálního životního cyklu.
var StableGeoRasterLayer = GeoRasterLayer.extend({
    initialize: function (options) {
        // Cache dlaždic drží GeoRasterLayer na prototypu a klíčuje ji pouze
        // souřadnicemi dlaždice a rozlišením, bez identity vrstvy. Všechny
        // instance si tak navzájem podstrkávají cizí dlaždice - přepnutí na
        // jinou vrstvu RYPE pak vykreslí data té předchozí. Vlastní cache
        // pro každou instanci.
        this.cache = {};
        GeoRasterLayer.prototype.initialize.call(this, options);
    },

    createTile: function (coords, done) {
        return GeoRasterLayer.prototype.createTile.call(this, coords, function (error, tile) {
            setTimeout(function () { done(error, tile); }, 0);
        });
    }
});

// Společná tovární funkce pro rastrové vrstvy
function createRasterLayer(url, layerName, pixelValuesToColorFn, label) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => parseGeoraster(arrayBuffer))
        .then(georaster => {
            var tiffLayer = new StableGeoRasterLayer({
                georaster: georaster,
                opacity: 0.8,
                resolution: 256,
                pane: 'rasterPane',
                pixelValuesToColorFn: function (pixelValues) {
                    return pixelValuesToColorFn(pixelValues[0], georaster);
                }
            });
            allRasterLayers.push(tiffLayer);
            // INJECT DIRECTLY INTO THE MENU UNDER "RYPE"
            layerControl.addOverlay(tiffLayer, layerName, "RYPE");
        })
        .catch(error => console.error(`Error loading ${label}:`, error));
}

// 1. FUNCTION FOR EVI
function createEVIlayer(url, layerName) {
    createRasterLayer(url, layerName, function (val, georaster) {
        if (val === georaster.noDataValue || isNaN(val)) return null;

        var ratio = Math.max(0, Math.min(1, val));
        var colors = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];
        var index = Math.floor(ratio * 8);
        if (index >= 8) index = 7;
        return colors[index];
    }, 'EVI');
}

// 2. FUNCTION FOR YIELD
function createYieldLayer(url, layerName) {
    createRasterLayer(url, layerName, function (val, georaster) {
        if (val === georaster.noDataValue || isNaN(val)) return null;

        var min = 78;
        var max = 115;
        var ratio = Math.max(0, Math.min(1, (val - min) / (max - min)));
        var colors = ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'];
        var index = Math.floor(ratio * 8);
        if (index >= 8) index = 7;
        return colors[index];
    }, 'Yield');
}

createYieldLayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_yield_2018_2025.tif', 'Average yield 2018-2025');

createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2018_evi.tif', 'EVI index 2018');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2019_evi.tif', 'EVI index 2019');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2020_evi.tif', 'EVI index 2020');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2021_evi.tif', 'EVI index 2021');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2022_evi.tif', 'EVI index 2022');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2023_evi.tif', 'EVI index 2023');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2024_evi.tif', 'EVI index 2024');
createEVIlayer('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/feature_1_2025_evi.tif', 'EVI index 2025');

// Load the GeoJSON data into the initialized layers
loadGeoJSON('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/ku.geojson', ku);
loadGeoJSON('https://raw.githubusercontent.com/DajanaSnopkova/mapa-repole/main/data/parcela.geojson', parcela);

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

//WMS legendy
var wmsLegend = L.control({ position: 'bottomleft' });

var activeWmsLayers = {};
var isLegendMinimized = false;

wmsLegend.onAdd = function (map) {
    // Create the container div
    this._div = L.DomUtil.create('div', 'dynamic-wms-legend');

    // Style the container
    this._div.style.backgroundColor = 'white';
    this._div.style.padding = '10px';
    this._div.style.borderRadius = '5px';
    this._div.style.maxHeight = '400px'; // Prevent it from getting too tall
    this._div.style.overflowY = 'hidden';
    this._div.style.display = 'none';    // Hide it initially

    // Stop map clicks from falling through the legend box
    L.DomEvent.disableClickPropagation(this._div);
    L.DomEvent.disableScrollPropagation(this._div);

    // Create a Clickable Header
    var header = L.DomUtil.create('div', 'legend-header', this._div);
    header.style.padding = '8px 10px';
    header.style.cursor = 'pointer';
    header.style.fontWeight = 'bold';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = '<span>Legenda</span><span id="legend-toggle-icon" style="margin-left:20px; font-size:18px; line-height:1;">&minus;</span>';

    // Create the Content Area (where the images will go)
    this._contentDiv = L.DomUtil.create('div', 'legend-content', this._div);
    this._contentDiv.style.padding = '0 10px 10px 10px';
    this._contentDiv.style.maxHeight = '400px';
    this._contentDiv.style.overflowY = 'auto';

    // Toggle Collapse/Expand on header click
    L.DomEvent.on(header, 'click', function () {
        isLegendMinimized = !isLegendMinimized;
        var icon = document.getElementById('legend-toggle-icon');

        if (isLegendMinimized) {
            this._contentDiv.style.display = 'none';
            icon.innerHTML = '&#43;'; // Plus symbol
        } else {
            this._contentDiv.style.display = 'block';
            icon.innerHTML = '&minus;'; // Minus symbol
        }
    }, this);

    return this._div;
};

wmsLegend.addTo(map);

// Function to redraw the legend box based on active layers
function updateLegendBox() {
    var html = '';
    var hasLegends = false;

    // Loop through all currently active WMS layers
    for (var id in activeWmsLayers) {
        var layerInfo = activeWmsLayers[id];
        var layer = layerInfo.layer;

        // Safely handle the base URL (check if it already has a '?' query string)
        var separator = layer._url.indexOf('?') === -1 ? '?' : '&';

        // Auto-construct the GetLegendGraphic URL using the layer's own properties
        var legendUrl = layer._url + separator +
            "SERVICE=WMS&REQUEST=GetLegendGraphic" +
            "&VERSION=" + (layer.wmsParams.version || "1.3.0") +
            "&SLD_VERSION=1.1.0" +
            "&FORMAT=image/png" +
            "&LAYER=" + layer.wmsParams.layers;

        // Build the HTML for this specific legend
        html += '<div style="margin-bottom: 10px; border-top: 1px solid #eee; padding-top: 5px;">'; html += '<strong>' + layerInfo.name + '</strong><br>';
        html += '<img src="' + legendUrl + '" alt="Legend" style="max-width: 100%; margin-top: 5px;">';
        html += '</div>';

        hasLegends = true;
    }

    // Update only the content area, not the whole div
    if (wmsLegend._contentDiv) {
        wmsLegend._contentDiv.innerHTML = html;
    }

    // Show/hide the entire control based on if any layers are active
    wmsLegend._div.style.display = hasLegends ? 'block' : 'none';
}

// Listen to map events to know when layers turn on and off

// When a layer is turned on via the layer control
map.on('overlayadd', function (e) {
    // 1. LEGEND LOGIC: Check if it is a WMS layer
    if (e.layer.wmsParams) {
        activeWmsLayers[L.stamp(e.layer)] = {
            layer: e.layer,
            name: e.name
        };
        updateLegendBox();
    }

    // 2. RASTER ENFORCER LOGIC: Check if it is one of our TIFFs
    if (typeof allRasterLayers !== 'undefined' && allRasterLayers.includes(e.layer)) {
        allRasterLayers.forEach(function (layer) {
            // Remove any other TIFF currently sitting on the map
            if (layer !== e.layer && map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
    }
});

// When a layer is turned off
map.on('overlayremove', function (e) {
    if (e.layer.wmsParams) {
        // Remove it from our active list
        delete activeWmsLayers[L.stamp(e.layer)];
        updateLegendBox();
    }
});


/*
parcelyDP.on('add', function () { toggleLegend(parcelyDP, legend); });
parcelyDP.on('remove', function () { toggleLegend(parcelyDP, legend); });

parcelyNavrhOpatreni.on('add', function () { toggleLegend(parcelyNavrhOpatreni, legendNavrhOpatreni); });
parcelyNavrhOpatreni.on('remove', function () { toggleLegend(parcelyNavrhOpatreni, legendNavrhOpatreni); });
*/