var map = L.map('map').setView([48.802255, 16.96000], 14); // Hrušky

// Array to track all dynamically loaded TIFFs
var allRasterLayers = [];

// Icons for the layer control panel
var icons = {
    layers: '<svg class="nb-panel-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M10 2.5 2.5 6.5 10 10.5l7.5-4z"/><path d="m2.5 10 7.5 4 7.5-4"/><path d="m2.5 13.5 7.5 4 7.5-4"/></svg>',
    chevron: '<svg class="nb-panel-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>',
    chevronSmall: '<svg class="nb-group-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>',
    chevronLegend: '<svg class="legend-toggle-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>'
};

//Logo
var logo = L.control({ position: 'topleft' });
logo.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'nb-panel nb-logo');
    div.innerHTML = '<img src="./src/NB_horizontalni_Black.svg" alt="Nature Balance"/>';
    return div;
};
logo.addTo(map);

// Map controls
map.attributionControl._attributions = {};
map.attributionControl.setPrefix();
map.zoomControl.setPosition('topleft');
L.control.scale({ imperial: false, maxwidth: 200, position: 'bottomright' }).addTo(map);

// Backdrop layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

var orthoLayer = L.tileLayer('https://ags.cuzk.gov.cz/arcgis1/rest/services/ORTOFOTO_WM/MapServer/WMTS/tile/1.0.0/ORTOFOTO_WM/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg', {
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK Orthophoto</a>',
    maxZoom: 22
}).addTo(map);

// WMS layers

var kmGridLayer = L.tileLayer.wms("https://services.cuzk.cz/wms/local-km-wms.asp", {
    layers: 'KN_I',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK</a>'
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

var zabagedVrstevnice = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis/services/ZABAGED_VRSTEVNICE/MapServer/WmsServer", {
    layers: '0',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK</a>',
    tiled: true
});

var sklonitostSvahu = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis2/services/dmr5g/ImageServer/WMSServer", {
    layers: 'dmr5g:SlopeRGBMap2',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK DMR 5G</a>',
    tiled: true
});

var orientaceSvahu = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis2/services/dmr5g/ImageServer/WMSServer", {
    layers: 'dmr5g:AspectRGBMap',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; <a href="https://www.cuzk.cz">ČÚZK DMR 5G</a>',
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

// Vector layers
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

// Layer control list
var baseMaps = {
    "OpenStreetMaps": osmLayer,
    "Ortofoto": orthoLayer
};

var groupedOverlays = {
    "Podkladové vrstvy": {
        "Vybraná parcela": parcela,
        "Katastrální území": ku,
        "Katastrální mapa": kmGridLayer,
        "Sklonitost svahu": sklonitostSvahu,
        "Orientace svahu": orientaceSvahu,
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
        "Vrstevnice - ZABAGED": zabagedVrstevnice,
        "Stupeň, sráz - ZABAGED": zabagedSraz
    },
    "RYPE": {}
};

var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, {
    collapsed: false,
    collapsible: true,
    exclusiveGroups: ["RYPE"]
}).addTo(map);

var foldedGroups = { "Podkladové vrstvy": true };

// Mark active layers in the control panel 
function markActiveLayers() {
    var inputs = layerControl._container.querySelectorAll('.leaflet-control-layers-selector');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].parentNode.classList.toggle('nb-active', inputs[i].checked);
    }
}

// Header and group folding for the layer control panel
function decoratePanel() {
    var container = layerControl._container;

    if (!container.querySelector('.nb-panel-header')) {
        var header = L.DomUtil.create('div', 'nb-panel-header');
        header.innerHTML = icons.layers + '<span class="nb-panel-title">Vrstvy</span>' + icons.chevron;
        header.title = 'Skrýt / zobrazit panel vrstev';
        container.insertBefore(header, container.firstChild);
        L.DomEvent.on(header, 'click', function () {
            container.classList.toggle('nb-collapsed');
        });
    }

    var groups = container.querySelectorAll('.leaflet-control-layers-group');
    Array.prototype.forEach.call(groups, function (group) {
        var label = group.querySelector('.leaflet-control-layers-group-label');
        var name = label && label.querySelector('.leaflet-control-layers-group-name');
        if (!name) return;

        var groupName = name.textContent;
        label.insertAdjacentHTML('beforeend', icons.chevronSmall);
        label.title = 'Sbalit / rozbalit skupinu';

        group.classList.toggle('nb-folded', !!foldedGroups[groupName]);

        L.DomEvent.on(label, 'click', function () {
            foldedGroups[groupName] = group.classList.toggle('nb-folded');
        });
    });

    markActiveLayers();
}

// Raster loading and sorting
function sortRasterLayers() {
    var slots = [];
    var entries = [];

    layerControl._layers.forEach(function (entry, i) {
        if (entry && entry.layer.nbOrder !== undefined) {
            slots.push(i);
            entries.push(entry);
        }
    });

    entries.sort(function (a, b) { return a.layer.nbOrder - b.layer.nbOrder; });
    slots.forEach(function (slot, i) { layerControl._layers[slot] = entries[i]; });
}

var origLayerControlUpdate = layerControl._update;
layerControl._update = function () {
    sortRasterLayers();
    origLayerControlUpdate.call(this);
    decoratePanel();
};

decoratePanel();
map.on('layeradd layerremove', markActiveLayers);

function loadGeoJSON(url, layer) {
    fetch(url)
        .then(response => response.json())
        .then(data => layer.addData(data))
        .catch(error => console.error(`Error loading ${url}:`, error));
}

// New Raster pane for tiff layers
map.createPane('rasterPane');
map.getPane('rasterPane').style.zIndex = 350;
map.getPane('rasterPane').style.pointerEvents = 'none';

// Asynchronous tile creation for GeoRasterLayer
var StableGeoRasterLayer = GeoRasterLayer.extend({
    initialize: function (options) {
        this.cache = {};
        GeoRasterLayer.prototype.initialize.call(this, options);
    },

    createTile: function (coords, done) {
        return GeoRasterLayer.prototype.createTile.call(this, coords, function (error, tile) {
            setTimeout(function () { done(error, tile); }, 0);
        });
    }
});

// Color scales for EVI and Yield
var EVI_COLORS = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];
var YIELD_COLORS = ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'];

var rasterOrder = 0;

// Create a raster layer from a GeoTIFF URL
function createRasterLayer(url, layerName, pixelValuesToColorFn, legend, label) {
    var order = rasterOrder++;

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => parseGeoraster(arrayBuffer))
        .then(georaster => {
            var tiffLayer = new StableGeoRasterLayer({
                georaster: georaster,
                opacity: 0.8,
                resolution: 256,
                pane: 'rasterPane',
                attribution: 'RYPE',
                pixelValuesToColorFn: function (pixelValues) {
                    return pixelValuesToColorFn(pixelValues[0], georaster);
                }
            });
            tiffLayer.nbLegend = legend;
            tiffLayer.nbOrder = order;
            allRasterLayers.push(tiffLayer);
            layerControl.addOverlay(tiffLayer, layerName, "RYPE");
        })
        .catch(error => console.error(`Error loading ${label}:`, error));
}

// Raster coloring
function rampColor(ratio, colors) {
    var index = Math.floor(Math.max(0, Math.min(1, ratio)) * colors.length);
    if (index >= colors.length) index = colors.length - 1;
    return colors[index];
}

function divergingRatio(val, min, mid, max) {
    return val < mid
        ? 0.5 * (val - min) / (mid - min)
        : 0.5 + 0.5 * (val - mid) / (max - mid);
}

// FUNCTION FOR EVI
function createEVIlayer(url, layerName) {
    createRasterLayer(url, layerName, function (val, georaster) {
        if (val === georaster.noDataValue || isNaN(val)) return null;

        return rampColor(val, EVI_COLORS);
    }, { colors: EVI_COLORS, min: 0, max: 1, unit: '' }, 'EVI');
}

// FUNCTION FOR YIELD
function createYieldLayer(url, layerName) {
    var min = 78;
    var mid = 100;
    var max = 115;

    createRasterLayer(url, layerName, function (val, georaster) {
        if (val === georaster.noDataValue || isNaN(val)) return null;

        return rampColor(divergingRatio(val, min, mid, max), YIELD_COLORS);
    }, { colors: YIELD_COLORS, min: min, mid: mid, max: max, unit: '' }, 'Yield');
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

// Display legend if the layer is active
function toggleLegend(layerName, legendName) {
    if (map.hasLayer(layerName)) {
        legendName.addTo(map);
    } else {
        map.removeControl(legendName);
    }
};

// Add map legend

//WMS legends
var wmsLegend = L.control({ position: 'bottomleft' });

var activeWmsLayers = {};

wmsLegend.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'dynamic-wms-legend');
    this._div.style.display = 'none';
    L.DomEvent.disableClickPropagation(this._div);
    L.DomEvent.disableScrollPropagation(this._div);
    var header = L.DomUtil.create('div', 'legend-header', this._div);
    header.innerHTML = '<span>Legenda</span>' + icons.chevronLegend;
    this._contentDiv = L.DomUtil.create('div', 'legend-content', this._div);
    L.DomEvent.on(header, 'click', function () {
        this._div.classList.toggle('nb-minimized');
    }, this);

    return this._div;
};

wmsLegend.addTo(map);

// Legends for WMS layers - GetLegendGraphic
function wmsLegendHtml(layer) {
    var separator = layer._url.indexOf('?') === -1 ? '?' : '&';
    var legendUrl = layer._url + separator +
        "SERVICE=WMS&REQUEST=GetLegendGraphic" +
        "&VERSION=" + (layer.wmsParams.version || "1.3.0") +
        "&SLD_VERSION=1.1.0" +
        "&FORMAT=image/png" +
        "&LAYER=" + layer.wmsParams.layers;

    return '<img src="' + legendUrl + '" alt="Legenda">';
}

// Legend for RYPE
function rampLegendHtml(legend) {
    var swatches = legend.colors.map(function (color) {
        return '<span style="background:' + color + '"></span>';
    }).join('');

    var ticks = [legend.min, legend.mid, legend.max]
        .filter(function (value) { return value !== undefined; })
        .map(function (value) { return '<span>' + value + legend.unit + '</span>'; })
        .join('');

    return '<div class="legend-ramp">' + swatches + '</div>' +
        '<div class="legend-scale">' + ticks + '</div>';
}

// Function to redraw the legend box based on active layers
function updateLegendBox() {
    var html = '';
    var hasLegends = false;

    for (var id in activeWmsLayers) {
        var layerInfo = activeWmsLayers[id];
        var layer = layerInfo.layer;

        html += '<div class="legend-item">';
        html += '<div class="legend-item-title">' + layerInfo.name + '</div>';
        html += layer.nbLegend ? rampLegendHtml(layer.nbLegend) : wmsLegendHtml(layer);
        html += '</div>';

        hasLegends = true;
    }

    if (wmsLegend._contentDiv) {
        wmsLegend._contentDiv.innerHTML = html;
    }

    wmsLegend._div.style.display = hasLegends ? 'block' : 'none';
}

// Listen to map events to know when layers turn on and off

map.on('overlayadd', function (e) {
    if (e.layer.wmsParams || e.layer.nbLegend) {
        activeWmsLayers[L.stamp(e.layer)] = {
            layer: e.layer,
            name: e.name
        };
        updateLegendBox();
    }

    if (typeof allRasterLayers !== 'undefined' && allRasterLayers.includes(e.layer)) {
        allRasterLayers.forEach(function (layer) {
            if (layer !== e.layer && map.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        });
    }
});

map.on('overlayremove', function (e) {
    if (e.layer.wmsParams || e.layer.nbLegend) {
        delete activeWmsLayers[L.stamp(e.layer)];
        updateLegendBox();
    }
});