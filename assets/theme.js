var _themes = {};

// MapboxStreets
var tileMapboxStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a> | dev <a href="https://github.com/trichimtrich/coronavietnam">trichimtrich</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZGF5bGFkYXUzIiwiYSI6ImNrN2s5MmU0YzE0aWszbXFsa3lnZ2p5dHIifQ.TrqqzLJTt7gf5PZZZLr0pQ'
});
_themes.MapboxStreets = {
    tile: tileMapboxStreets,
    color: {
        new: "orangered",
        update: "gold",
        old: "darkorange",
        discharge: "mediumseagreen",
        indirect: "lightslategray",
    },
    opacity: {
        enable: 0.9,
        disable: 0.3,
    }
};


// CartoDB_DarkMatter
var tileCartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | dev <a href="https://github.com/trichimtrich/coronavietnam">trichimtrich</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
_themes.CartoDB_DarkMatter = {
    tile: tileCartoDB_DarkMatter,
    color: {
        new: "red",
        update: "yellow",
        old: "orange",
        discharge: "lightgreen",
        indirect: "lightgray",
    },
    opacity: {
        enable: 0.9,
        disable: 0.2,
    }
};


// CartoDB_Positron
var tileCartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | dev <a href="https://github.com/trichimtrich/coronavietnam">trichimtrich</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
_themes.CartoDB_Positron = {
    color: {
        new: "orangered",
        update: "gold",
        old: "darkorange",
        discharge: "mediumseagreen",
        indirect: "lightslategray",
    },
    opacity: {
        enable: 0.9,
        disable: 0.3,
    }
};


// An trom cua VietMap, hihi ^^
// https://maps.vietmap.vn/web/tile-mapapi/#tilemap
var tileVietMap = L.tileLayer('https://maps.vietmap.vn/tm6/{z}/{x}/{y}@2x.png?apikey={token}', {
    attribution: '&copy; <a href="https://maps.vietmap.vn/copyright">Vietmap</a> contributors | dev <a href="https://github.com/trichimtrich/coronavietnam">trichimtrich</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    token: 'f50f96fd875c023e6fd8acac6d9a7e0d15699071d3259542'
});
_themes.VietMap = {
    tile: tileVietMap,
    color: {
        new: "orangered",
        update: "gold",
        old: "darkorange",
        discharge: "mediumseagreen",
        indirect: "lightslategray",
    },
    opacity: {
        enable: 0.9,
        disable: 0.3,
    }
};


window.themes = _themes;