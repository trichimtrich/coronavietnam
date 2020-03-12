var COLOR = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5", "#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];


function toggleSidebar() {
    if (window.sidebar == 0)
        return;

    var state = window.sidebar;
    window.sidebar = 0;
    $("#my-sidebar").animate({ "width": (state>0?0:400) }, 400, function () {
        window.sidebar = -state;
        $(".detail-control").html(`<img src="https://image.flaticon.com/icons/svg/271/${state>0?271228:271220}.svg">`);
    });
    $("#mapid").animate({ "margin-left": (state>0?0:400) });
}


function LoadTheme(name) {
    var theme = window.themes[name];
    document.body.append(`
        <style>
            .case-new { background-color: ${theme.color.new}; }
            .case-old { background-color: ${theme.color.old}; }
            .case-update { background-color: ${theme.color.update}; }
            .case-discharge { background-color: ${theme.color.discharge}; }
        </style>
    `);

    return theme;
}


function CreateMap(theme) {
    // init map location
    var myMap = L.map("mapid").setView([15.792, 107.403], 6);

    // load map tile
    theme.tile.addTo(myMap);

    // add legend to bottom right
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var _div = L.DomUtil.create("div", "info legend");

        _div.innerHTML = `
            <i style="background: ${theme.color.new}"></i> Ca nhiễm mới<br>
            <i style="background: ${theme.color.update}"></i> Ca cập nhật info<br>
            <i style="background: ${theme.color.old}"></i> Ca nhiễm cũ<br>
            <i style="background: ${theme.color.discharge}"></i> Ca xuất viện<br>
            <i style="background: ${theme.color.indirect}"></i> Địa điểm liên quan<br>
        `;

        return _div;
    };
    legend.addTo(myMap);

    // add github icon
    var legend2 = L.control({ position: "topright" });
    legend2.onAdd = function (map) {
        var _div = L.DomUtil.create("div");
        // Raw copy: http://tholman.com/github-corners/
        _div.innerHTML = `<a href="https://github.com/trichimtrich/trichimtrich.github.io/" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
        return _div;

    }
    legend2.addTo(myMap);


    var btnDetail = L.control({ position: "topleft" });
    btnDetail.onAdd = function (map) {
        var _btn = L.DomUtil.create("div", "detail-control");
        // var _btn = L.DomUtil.create("div", "leaflet-bar");
        _btn.title = "Click for more detail";
        _btn.innerHTML = "<img src='https://image.flaticon.com/icons/svg/271/271228.svg'>";
        _btn.addEventListener("click", toggleSidebar);
        return _btn;
    };
    btnDetail.addTo(myMap);

    return myMap;
}
