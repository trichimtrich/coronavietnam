function OpenSidebar() {
    if (isMobile() && screen.width < screen.height) {
        alert("Chuyển sang màn hình ngang để mở sidebar");
        return;
    }

    if (window.sidebar == 0)
        return;

    window.sidebar = 0;
    $("#my-sidebar").animate({ "width": 400 }, 400, function () {
        window.sidebar = 1;
        $("#sidebar-btn").html(`<img src="https://image.flaticon.com/icons/svg/271/271220.svg">`);
    });
    $("#mapid").animate({ "margin-left": 400 }); 
}


function CloseSidebar() {
    if (window.sidebar == 0)
        return;

    window.sidebar = 0;
    $("#my-sidebar").animate({ "width": 0 }, 400, function () {
        window.sidebar = -1;
        $("#sidebar-btn").html(`<img src="https://image.flaticon.com/icons/svg/271/271228.svg">`);
    });
    $("#mapid").animate({ "margin-left": 0 }); 
}


function LoadTheme() {
    if (window.theme)
        window.theme.tile.remove();

    var name;
    if (window.isDark) {
        $("#theme-btn").html("<img src='https://image.flaticon.com/icons/svg/405/405894.svg'>");
        name = "CartoDB_DarkMatter";
    } else {
        $("#theme-btn").html("<img src='https://image.flaticon.com/icons/svg/1415/1415431.svg'>");
        name = "VietMap";
    }

    var theme = window.themes[name];

    $("body style").remove();
    $("body").append(`
        <style>
            .case-new { background-color: ${theme.color.new}; }
            .case-old { background-color: ${theme.color.old}; }
            .case-update { background-color: ${theme.color.update}; }
            .case-discharge { background-color: ${theme.color.discharge}; }
        </style>
    `);

    // load map tile
    theme.tile.addTo(window.myMap);
    
    $(".legend").html( `
        <i style="background: ${theme.color.new}"></i> Ca nhiễm mới<br>
        <i style="background: ${theme.color.update}"></i> Ca cập nhật info<br>
        <i style="background: ${theme.color.old}"></i> Ca nhiễm cũ<br>
        <i style="background: ${theme.color.discharge}"></i> Ca xuất viện<br>
        <i style="background: ${theme.color.indirect}"></i> Địa điểm liên quan<br>
    `);


    // set marker color if available
    if (window.locations)
        for (const [_, loc] of Object.entries(locations)) {
            loc.marker.setStyle({
                fillColor: theme.color[loc.state],
                fillOpacity: theme.opacity.enable,
            });
        }

    window.theme = theme;
}


function CreateMap() {
    // init map location
    var myMap = L.map("mapid");

    function _resetMapView() {
        // myMap.setView([14.058324, 108.277199], 6);
        myMap.fitBounds([
                [23.541811, 101.571622],
                [8.5056463, 110.4280715] 
            ]
        );
    }
    _resetMapView();

    
    // add github icon
    var legend2 = L.control({ position: "topright" });
    legend2.onAdd = function () {
        var _div = L.DomUtil.create("div");
        // Raw copy: http://tholman.com/github-corners/
        _div.innerHTML = `<a href="https://github.com/trichimtrich/coronavietnam" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
        return _div;

    }
    legend2.addTo(myMap);

    // add legend to bottom right
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var _div = L.DomUtil.create("div", "info legend");
        return _div;
    }
    legend.addTo(myMap);


    // add button to control sidebar
    var btnSidebar = L.control({ position: "topleft" });
    btnSidebar.onAdd = function () {
        var _btn = L.DomUtil.create("div", "btn-control");
        _btn.id = "sidebar-btn";
        _btn.title = "Open or hide sidebar";
        _btn.innerHTML = "<img src='https://image.flaticon.com/icons/svg/271/271228.svg'>";
        $(_btn).on("click", function() {
            if (window.sidebar < 0)
                OpenSidebar();
            else if (window.sidebar > 0)
                CloseSidebar();
        });
        return _btn;
    };
    btnSidebar.addTo(myMap);


    // add button to show all cases
    var btnReset = L.control({ position: "topleft" });
    btnReset.onAdd = function () {
        var _btn = L.DomUtil.create("div", "btn-control");
        _btn.id = "reset-btn";
        _btn.title = "Reset sidebar";
        _btn.innerHTML = "<img src='https://image.flaticon.com/icons/svg/1828/1828727.svg'>";
        $(_btn).on("click", function() {
            AddCasesToSidebar();
            OpenSidebar();
            _resetMapView();
        });
        return _btn;
    };
    btnReset.addTo(myMap);

        
    // dark mode button
    var btnTheme = L.control({ position: "bottomleft" });
    btnTheme.onAdd = function () {
        var _btn = L.DomUtil.create("div", "btn-control");
        _btn.id = "theme-btn";
        _btn.title = "Dark mode";
        $(_btn).on("click", function() {
            window.isDark = ! window.isDark;
            window.localStorage.setItem("darkmode", window.isDark);
            LoadTheme();
        });
        return _btn;
    };
    btnTheme.addTo(myMap);

    window.myMap = myMap;
}


function AddCaseToSidebar(caseNo, lName) {
    var cases = window.cases;
    var locations = window.locations;

    var ca = cases[caseNo];

    const emojiAge = {
        male: ["👴👨🧑👦👶", 65, 40, 22, 5, 0],
        female: ["👵👩🧒👧👶", 65, 40, 22, 5, 0]
    }
    var emoji;
    if (ca.gender == "male" || ca.gender == "female") {
        for (var i = 1; i < emojiAge[ca.gender].length; i++) {
            if (ca.age >= emojiAge[ca.gender][i]) {
                emoji = [...emojiAge[ca.gender][0]][i - 1];
                break;
            }
        }
    } else {
        emoji = "❌"
    }

    var htmlCase = `
        <div class="case-container case-${ca.caseType}" no="${caseNo}">
            <div class="case-no one-line">Ca ${caseNo.substr(2)}</div>
            <div class="case-info one-line">${ca.age} tuổi - ${emoji}</div>
            <div class="case-location one-line">${ca.stayed}</div>
        </div>
    `;

    var htmlLocation = "";

    if (lName != false) {
        ca.locNames.forEach(locName => {
            loc = locations[locName];

            // Copy https://www.flaticon.com/
            htmlLocation += `
                <div class="location ${lName==locName?"picked":""}" loc="${locName}">
                    <div class="location-icon"><img src="https://image.flaticon.com/icons/svg/${loc.last?"1097/1097326":"1497/1497068"}.svg"></div>
                    <div class="location-line one-line">${loc.desc}</div>
                </div>
            `;
        });

        htmlLocation = `
            <div class="location-container">
                ${htmlLocation}
            </div>
        `;
    }

    $("#my-sidebar").append(`
        ${htmlCase}    
        ${htmlLocation}
    `);

}


function AddCasesToSidebar() {
    var cases = window.cases;
    
    $("#my-sidebar").empty();
    for (const [caseNo, ca] of Object.entries(cases).sort(
                (a, b) => {
                    var idx1 = NODE_STATE.indexOf(a[1].caseType);
                    var idx2 = NODE_STATE.indexOf(b[1].caseType);
                    if (idx1 == idx2) {
                        var no1 = parseInt(a[0].substr(2));
                        var no2 = parseInt(b[0].substr(2));
                        return no2 - no1;
                    } else
                        return idx1 - idx2;
                }
            )
        )
    {
        AddCaseToSidebar(caseNo, false);
    }
}