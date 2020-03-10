var _themes = {};

// MapboxStreets
var tileMapboxStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZGF5bGFkYXUzIiwiYSI6ImNrN2s5MmU0YzE0aWszbXFsa3lnZ2p5dHIifQ.TrqqzLJTt7gf5PZZZLr0pQ'
});
_themes.MapboxStreets = {
    tile: tileMapboxStreets,
    color: {
        directNew: "red",
        directOld: "orange",
        indirect: "gray",
        line: "green",
    },
    opacity: {
        enable: 0.9,
        disable: 0.5,
    }
};

// CartoDB_DarkMatter
var tileCartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
_themes.CartoDB_DarkMatter = {
    tile: tileCartoDB_DarkMatter,
    color: {
        directNew: "red",
        directOld: "orange",
        indirect: "lightgray",
        line: "lightblue",
    },
    opacity: {
        enable: 0.9,
        disable: 0.2,
    }
};

// CartoDB_Positron
var tileCartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
});
_themes.CartoDB_Positron = {
    tile: tileCartoDB_Positron,
    color: {
        directNew: "red",
        directOld: "orange",
        indirect: "gray",
        line: "blue",
    },
    opacity: {
        enable: 0.9,
        disable: 0.5,
    }
};


window.themes = _themes;