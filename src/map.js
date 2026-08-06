var map = L.map('map').setView([48.802255, 16.96000], 14); // Hrušky

// Array to track all dynamically loaded TIFFs
var allRasterLayers = [];

// Ikony (inline SVG, ať se nečeká na Font Awesome)
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

var zabagedVrstevnice = L.tileLayer.wms("https://ags.cuzk.gov.cz/arcgis/services/ZABAGED_VRSTEVNICE/MapServer/WmsServer", {
    layers: '0',
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
        "Stupeň, sráz - ZABAGED": zabagedSraz,
        "Vrstevnice - ZABAGED": zabagedVrstevnice
    },
    "RYPE": {}
};


// Initialize the control immediately
var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, {
    collapsed: false,
    collapsible: true,
    exclusiveGroups: ["RYPE"]
}).addTo(map);

// Skupiny, které mají být po startu sbalené (klíč = název skupiny)
var foldedGroups = { "Podkladové vrstvy": true };

// Zvýraznění zapnutých vrstev. Čte se stav inputu, který sedí jak po překreslení
// panelu (_update nastaví checked podle mapy), tak po kliknutí uživatele.
function markActiveLayers() {
    var inputs = layerControl._container.querySelectorAll('.leaflet-control-layers-selector');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].parentNode.classList.toggle('nb-active', inputs[i].checked);
    }
}

// Hlavička panelu a sbalovací skupiny.
function decoratePanel() {
    var container = layerControl._container;

    // Hlavička se vkládá jen jednou - _update() přepisuje pouze obsah formuláře
    if (!container.querySelector('.nb-panel-header')) {
        var header = L.DomUtil.create('div', 'nb-panel-header');
        header.innerHTML = icons.layers + '<span class="nb-panel-title">Vrstvy</span>' + icons.chevron;
        header.title = 'Skrýt / zobrazit panel vrstev';
        container.insertBefore(header, container.firstChild);
        L.DomEvent.on(header, 'click', function () {
            container.classList.toggle('nb-collapsed');
        });
    }

    // Skupiny naopak _update() vytváří znovu, takže se dekorují pokaždé
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

// Rastry se stahují asynchronně, takže se do panelu zapisují v pořadí, v jakém
// dorazí ze sítě. Před každým překreslením je přerovnáme podle nbOrder, což je
// pořadí volání v kódu. Ostatní vrstvy zůstávají na svých místech - entries se
// zapisují zpět jen do slotů, které rastry už zabíraly.
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

// Barevné škály rastrů
var EVI_COLORS = ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', '#66c2a5', '#3288bd'];
var YIELD_COLORS = ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'];

// Pořadí rastrů v panelu - přiřazuje se hned při volání, ne až po stažení dat
var rasterOrder = 0;

// Společná tovární funkce pro rastrové vrstvy.
// `legend` popisuje škálu pro legendu: { colors, min, mid, max, unit }
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
            // INJECT DIRECTLY INTO THE MENU UNDER "RYPE"
            layerControl.addOverlay(tiffLayer, layerName, "RYPE");
        })
        .catch(error => console.error(`Error loading ${label}:`, error));
}

// Zařazení hodnoty do jednoho z osmi barevných kroků
function rampColor(ratio, colors) {
    var index = Math.floor(Math.max(0, Math.min(1, ratio)) * colors.length);
    if (index >= colors.length) index = colors.length - 1;
    return colors[index];
}

// Divergentní škála: `mid` padne přesně doprostřed barevné škály, obě poloviny
// se roztáhnou nezávisle. Pro výnos tak průměr (100) leží uprostřed legendy
// i když není aritmetickým středem rozsahu min-max.
function divergingRatio(val, min, mid, max) {
    return val < mid
        ? 0.5 * (val - min) / (mid - min)
        : 0.5 + 0.5 * (val - mid) / (max - mid);
}

// 1. FUNCTION FOR EVI
function createEVIlayer(url, layerName) {
    createRasterLayer(url, layerName, function (val, georaster) {
        if (val === georaster.noDataValue || isNaN(val)) return null;

        return rampColor(val, EVI_COLORS);
    }, { colors: EVI_COLORS, min: 0, max: 1, unit: '' }, 'EVI');
}

// 2. FUNCTION FOR YIELD
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

wmsLegend.onAdd = function (map) {
    // Create the container div
    this._div = L.DomUtil.create('div', 'dynamic-wms-legend');
    this._div.style.display = 'none';    // Hide it initially

    // Stop map clicks from falling through the legend box
    L.DomEvent.disableClickPropagation(this._div);
    L.DomEvent.disableScrollPropagation(this._div);

    // Create a Clickable Header
    var header = L.DomUtil.create('div', 'legend-header', this._div);
    header.innerHTML = '<span>Legenda</span>' + icons.chevronLegend;

    // Create the Content Area (where the images will go)
    this._contentDiv = L.DomUtil.create('div', 'legend-content', this._div);

    // Toggle Collapse/Expand on header click
    L.DomEvent.on(header, 'click', function () {
        this._div.classList.toggle('nb-minimized');
    }, this);

    return this._div;
};

wmsLegend.addTo(map);

// Legenda WMS vrstvy - obrázek ze služby GetLegendGraphic
function wmsLegendHtml(layer) {
    // Safely handle the base URL (check if it already has a '?' query string)
    var separator = layer._url.indexOf('?') === -1 ? '?' : '&';

    // Auto-construct the GetLegendGraphic URL using the layer's own properties
    var legendUrl = layer._url + separator +
        "SERVICE=WMS&REQUEST=GetLegendGraphic" +
        "&VERSION=" + (layer.wmsParams.version || "1.3.0") +
        "&SLD_VERSION=1.1.0" +
        "&FORMAT=image/png" +
        "&LAYER=" + layer.wmsParams.layers;

    return '<img src="' + legendUrl + '" alt="Legenda">';
}

// Legenda rastru RYPE - barevná škála s krajními hodnotami
// a u divergentní škály i s hodnotou uprostřed
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

    // Loop through all currently active layers that have a legend
    for (var id in activeWmsLayers) {
        var layerInfo = activeWmsLayers[id];
        var layer = layerInfo.layer;

        html += '<div class="legend-item">';
        html += '<div class="legend-item-title">' + layerInfo.name + '</div>';
        html += layer.nbLegend ? rampLegendHtml(layer.nbLegend) : wmsLegendHtml(layer);
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
    // 1. LEGEND LOGIC: WMS vrstva nebo rastr RYPE s vlastní škálou
    if (e.layer.wmsParams || e.layer.nbLegend) {
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
    if (e.layer.wmsParams || e.layer.nbLegend) {
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