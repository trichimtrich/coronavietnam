function parseGoogleMap(url) {
    var data, lat, lng;
    data = /!3d([-.\d]+)!4d([-.\d]+)/.exec(url);
    if (data) {
        lat = parseFloat(data[1]);
        lng = parseFloat(data[2]);
    } else {
        data = /@([-.\d]+),([-.\d]+),/.exec(url);
        if (data) {
            lat = parseFloat(data[1]);
            lng = parseFloat(data[2]);
        } else {
            console.log("[Error] Cant parse this url");
            console.log(url);
        }
    }
    return [lat, lng];
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
        _div.innerHTML = `<a href="https://github.com/trichimtrich/trichimtrich.github.io/tree/master/covi" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>`;
        return _div;

    }
    legend2.addTo(myMap);

    return myMap;
}


async function LoadData() {
    var resp = await fetch(`./list.json`);
    const _cases = await resp.json();

    var cases = {};
    for (var i = 0; i < _cases.length; i++) {
        var caseNo = _cases[i];
        var response = await fetch(`./cases/${caseNo}.json`);
        cases[caseNo] = await response.json();
    }

    return cases;
}


function RenderDataToMap(cases, myMap, theme) {
    var locations = {};

    var isMarkerArr = false;
    var markerArr = Array();

    // cases schedule -> locations
    for (const [key, ca] of Object.entries(cases)) {
        ca.edge = Array();
        ca.rootLocs = Array();
        ca.leafLocs = Array();

        for ([locName, loc] of Object.entries(ca.nodes)) {
            // parse google map
            if ("url" in loc) {
                [loc.lat, loc.lng] = parseGoogleMap(loc.url);
            }

            // duplicate in name
            var isDup = false;
            if (locName in locations) {
                isDup = true;
            } else {
                for ([tmpName, tmpLoc] of Object.entries(locations)) {
                    if (tmpLoc.lat == loc.lat && tmpLoc.lng == loc.lng) {
                        // duplicate in lat - lng
                        locName = tmpName;
                        isDup = true;
                        break;
                    }
                }
            }
            if (!isDup) {
                // not duplicate -> add to map
                locations[locName] = loc;
            }

            var wrapLoc = locations[locName]; // == loc in [lat, lng]

            if (!("link" in wrapLoc)) {
                wrapLoc.link = Array();
            }

            var linkType;
            if (loc.last) {
                linkType = ca.caseType; // new - old
                ca.rootLocs.push(locName);
            } else {
                linkType = "indirect"; // indirect
                ca.leafLocs.push(locName);
            }

            wrapLoc.link.push([key, linkType]);
        };

        // if has at least 1 rootLocs
        ca.rootLocs.forEach(rootName => {
            ca.leafLocs.forEach(leafName => {
                var locRoot = locations[rootName];
                    locLeaf = locations[leafName];

                // calc Bézier curve between root -> leaf
                var offsetX = locRoot.lng - locLeaf.lng,
                    offsetY = locRoot.lat - locLeaf.lat;
                var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
                    theta = Math.atan2(offsetY, offsetX);
                var thetaOffset = (3.14 / 10);
                var r2 = (r / 2) / (Math.cos(thetaOffset)),
                    theta2 = theta + thetaOffset;

                var midpointX = (r2 * Math.cos(theta2)) + locLeaf.lng,
                    midpointY = (r2 * Math.sin(theta2)) + locLeaf.lat;
                var midpointLatLng = [midpointY, midpointX];

                // generate connection between root -> leaf
                var line = L.curve(
                    [
                        "M", [locRoot.lat, locRoot.lng], 
                        "Q", midpointLatLng, 
                        [locLeaf.lat, locLeaf.lng]
                    ], 
                    {
                        weight: 2,
                        color: theme.color.line,
                        animate: { duration: 1000 }
                    }
                );

                ca.edge.push(line);
            });
        });
    }

    const NODE_STATE = ["new", "update", "old", "discharge", "indirect"];

    for (const [_, loc] of Object.entries(locations)) {
        var stateIdx = Infinity;
        var noDirect = Array(),
            noIndirect = Array();

        loc.link.forEach(([caseNo, linkType]) => {
            // new > update > old > discharge > indirect
            var idx = NODE_STATE.indexOf(linkType);
            if (idx < stateIdx) {
                stateIdx = idx;
            }

            if (linkType == "indirect") {
                if (!noIndirect.includes(caseNo)) {
                    noIndirect.push(caseNo);
                }
            } else {
                if (!noDirect.includes(caseNo)) {
                    noDirect.push(caseNo);
                }
            }
        });

        loc.state = NODE_STATE[stateIdx];

        var desc;
        if ("url" in loc) {
            desc = `Location: <a href="${loc.url}" target="_blank">${loc.desc}</a><br>`;
        } else {
            desc = `Location: <a href="https://www.google.com/maps/@${loc.lat},${loc.lng},17z/" target="_blank">${loc.desc}</a><br>`;
        }
        
        var noRelated = noIndirect.slice();
        if (noDirect.length > 0) {
            // TODO: redesign the popup layout
            var descCase = noDirect.map(no => `<a href="#">#${no}</a>`).join(", ");
            var descAge = noDirect.map(no => cases[no].age).join(", ");
            var descGender = noDirect.map(no => cases[no].gender).join(" ");
            var descConfirmDate = cases[noDirect[0]].confirmDate;
            var descFrom = cases[noDirect[0]].from;
            var descCitizenship = cases[noDirect[0]].citizenship;
            var descStayed = cases[noDirect[0]].stayed;
            var descVisited = cases[noDirect[0]].visited;
            var descCustom = cases[noDirect[0]].customHTML;

            // var noRefs = Array();

            // merge related cases together (by location + cases related)
            noDirect.forEach(no => {
                noRelated = noRelated.concat(cases[no].relatedCaseNo);
                // noRefs = noRefs.concat(cases[no].reference);
            });

            //noRefs = [...(new Set(noRefs))];
            // var descRef = noRefs.map((ref, idx) => `<a href="${ref}" target="_blank">${idx}</a>`).join(" - ");

            desc += `
                Ca số: ${descCase}<br>
                Tuổi: ${descAge}<br>
                Giới tính: ${descGender}<br>
                Ngày phát hiện: ${descConfirmDate}<br>
                Vùng: ${descFrom}<br>
                Quốc tịch: ${descCitizenship}<br>
                Nơi đã đi: ${descVisited}<br>
                Nơi ở: ${descStayed}<br>
                ${descCustom}
            `;
        }

        noRelated = [...(new Set(noRelated))]; // unique
        var descRelated = noRelated.map(no => `<a href="#">#${no}</a>`).join(" ");
        desc += `${(descRelated?"Ca liên quan: ":"") + descRelated}`;


        // create marker with "color"
        var marker = L.circleMarker([loc.lat, loc.lng], {
            stroke: false,
            fill: true,
            fillColor: theme.color[loc.state],
            fillOpacity: theme.opacity.enable,
        }).addTo(myMap);
        loc.marker = marker;

        var popup = L.popup();
        popup.setContent(desc);
        marker.bindPopup(popup);

        marker.on("mouseup", function () {
            isMarkerArr = markerArr.includes(this);
        })

        marker.on("popupopen", () => {
            // popup another node in pool, reset flag, do nothing
            if (isMarkerArr) {
                isMarkerArr = false;
                return;
            }

            // disable all node
            for ([__, loc2] of Object.entries(locations)) {
                loc2.marker.setStyle({
                    fillOpacity: theme.opacity.disable
                });
            }

            // all cases link to this node
            markerArr = Array();
            loc.link.forEach(([caseNo, linkType]) => {
                var ca = cases[caseNo];

                // show edge between related nodes
                ca.edge.forEach(line => {
                    line.addTo(myMap);
                });

                // enable all related nodes
                Array.prototype.concat(ca.rootLocs, ca.leafLocs).forEach(locName => {
                    loc3 = locations[locName];
                    loc3.marker.setStyle({
                        fillOpacity: theme.opacity.enable
                    });
                    loc3.marker.bringToFront();
                    markerArr.push(loc3.marker);
                });
            });

            // enable this node in case no root link ?
            loc.marker.setStyle({
                fillOpacity: theme.opacity.enable
            });
            loc.marker.bringToFront();
        });

        marker.on("popupclose", () => {
            // popup another node in pool, do nothing
            if (isMarkerArr) {
                return;
            } else {
                // reset pool
                markerArr = Array();
            }

            // all cases link to this node
            loc.link.forEach(([caseNo, linkType]) => {
                var ca = cases[caseNo];

                // hide edge between related nodes
                ca.edge.forEach(line => {
                    line.remove();
                });
            });

            // enable all node
            for ([__, loc2] of Object.entries(locations)) {
                loc2.marker.setStyle({
                    fillOpacity: theme.opacity.enable
                });
            }
        });

    }

    for (const [_, loc] of Object.entries(locations)) {
        if (loc.state == "new" || loc.state == "update") {
            console.log("hihi");
            loc.marker.bringToFront();
        }
    }
}