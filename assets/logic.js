async function LoadData() {
    // always load latest list in no-cache mode
    var resp = await fetch(`./list.json?t=${Math.random()}`);
    const _cases = await resp.json();

    var cases = {};
    for (var i = 0; i < _cases.length; i++) {
        var caseNo = _cases[i];
        var response = await fetch(`./cases/${caseNo}.json`);
        cases[caseNo] = await response.json();
    }

    window.cases = cases;
}


function ProcessData() {
    var cases = window.cases;
    var locations = {};

    // cases traveling history -> locations
    for (const [caseNo, ca] of Object.entries(cases)) {
        var rootLocNames = Array(),
            leafLocNames = Array();

        for ([locName, loc] of Object.entries(ca.nodes)) {
            // parse google map
            if ("url" in loc) {
                [loc.lat, loc.lng] = parseGoogleMap(loc.url);
            }

            // same location in name
            var isDup = false;
            if (locName in locations) {
                isDup = true;
            } else {
                for ([tmpName, tmpLoc] of Object.entries(locations)) {
                    if (tmpLoc.lat == loc.lat && tmpLoc.lng == loc.lng) {
                        // log this noob note in case data mismatch
                        console.log(`[Case ${caseNo}] "${locName}" has same location with "${tmpName}"`);

                        // same location in [lat, lng]
                        locName = tmpName;
                        isDup = true;
                        break;
                    }
                }
            }
            if (!isDup) {
                // new location -> reset array of linked cases + add to map
                loc.link = Array();
                locations[locName] = loc;
            }

            var wrapLoc = locations[locName];

            var linkType;
            if (loc.last) {
                linkType = ca.caseType; // new - update - old - discharge
                // newer case -> top priority
                rootLocNames.unshift(locName);
            } else {
                linkType = "indirect"; // indirect
                // newer case -> top priority
                leafLocNames.unshift(locName);
            }

            // sort by priority: new > update > old > discharge > indirect
            var isBiggest = true;
            for (var i = 0; i < wrapLoc.link.length; i++) {
                var lvlA = NODE_STATE.indexOf(wrapLoc.link[i][1]);
                var lvlB = NODE_STATE.indexOf(linkType);
                if (lvlB <= lvlA) {
                    wrapLoc.link.splice(i, 0, [caseNo, linkType]);
                    isBiggest = false;
                    break;
                }
            }
            if (isBiggest)
                wrapLoc.link.push([caseNo, linkType]);
        };

        // combine all new location name in priority
        ca.locNames = Array.prototype.concat(rootLocNames, leafLocNames);

        // if has at least 1 rootLocs, drawing connection
        ca.edge = Array();
        rootLocNames.forEach(rootName => {
            leafLocNames.forEach(leafName => {
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
                        animate: { duration: 1000 }
                    }
                );

                ca.edge.push(line);
            });
        });
    }

    window.locations = locations;
}


function RenderDataToMap() {
    var cases = window.cases;
    var locations = window.locations;
    var myMap = window.myMap;
    var theme = window.theme;

    function _bringLatestToFront() {
        for (const [_, loc] of Object.entries(locations)) {
            if (loc.state != "indirect") {
                loc.marker.bringToFront();
            }
        }
    }

    for (const [lName, loc] of Object.entries(locations)) {
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

        if ("url" in loc) {
            loc.desc = `<a href="${loc.url}" target="_blank">${loc.desc}</a>`;
        } else {
            loc.desc = `<a href="https://www.google.com/maps/@${loc.lat},${loc.lng},17z/" target="_blank">${loc.desc}</a>`;
        }

        var popupDesc = `Location: ${loc.desc}<br>`;
        
        var noRelated = noIndirect.slice();
        if (noDirect.length > 0) {
            // TODO: redesign the popup layout
            var descCase = noDirect.map(no => `<a class="a-link-case" href="#" no="${no}" loc="${lName}">#${no}</a>`).join(", ");
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

            popupDesc += `
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
        var descRelated = noRelated.map(no => `<a class="a-link-case" href="#" no="${no}" loc="${lName}">#${no}</a>`).join(" ");
        popupDesc += `${(descRelated?"Ca liên quan: ":"") + descRelated}`;


        // create marker with "color"
        var marker = L.circleMarker([loc.lat, loc.lng], {
            stroke: true,
            weight: 1,
            color: "#ccc",

            fill: true,
            fillColor: theme.color[loc.state],
            fillOpacity: theme.opacity.enable,
        }).addTo(myMap);
        loc.marker = marker;

        var popup = L.popup();
        popup.setContent(popupDesc);
        marker.bindPopup(popup);

        marker.on("mouseup", function () {
            isSamePool = pickedMarker.includes(lName);
        })

        marker.on("popupopen", function () {
            // highlight in sidebar
            $(`.location[loc=${lName}]`).addClass("picked");

            // popup another node in pool, reset flag, do nothing
            if (isSamePool) {
                isSamePool = false;
                return;
            }

            // disable all node
            for (const [_, loc2] of Object.entries(locations)) {
                loc2.marker.setStyle({
                    fillOpacity: theme.opacity.disable
                });
            }

            // reset sidebar
            $("#my-sidebar").empty();

            // all cases link to this node
            pickedMarker = Array();
            pickedCases = Array();
            loc.link.forEach(([caseNo, _], idx) => {
                pickedCases.push(caseNo);
                var ca = cases[caseNo];

                // show edge between related nodes
                ca.edge.forEach(line => {
                    line.setStyle({
                        color: COLOR[idx]
                    })
                    line.addTo(myMap);
                });

                // enable all related nodes
                ca.locNames.forEach(locName => {
                    pickedMarker.push(locName);
                    var loc3 = locations[locName];

                    loc3.marker.setStyle({
                        fillOpacity: theme.opacity.enable
                    });
                    loc3.marker.bringToFront();
                });

                _bringLatestToFront();

                // update sidebar
                AddCaseToSidebar(caseNo, lName);
            });

            // enable this node in case no root link ?
            loc.marker.setStyle({
                fillOpacity: theme.opacity.enable
            });
            loc.marker.bringToFront();

            

        });

        marker.on("popupclose", function () {
            // un-highlight in sidebar
            $(`.location[loc=${lName}]`).removeClass("picked");

            // popup another node in pool, do nothing
            if (isSamePool) {
                return;
            } else {
                // reset pool
                pickedMarker = Array();
                pickedCases = Array();
            }

            // disable all lines
            for (const [_, ca] of Object.entries(cases)) {
                ca.edge.forEach(line => {
                    line.remove();
                })
            }
            
            // enable all node
            for ([__, loc2] of Object.entries(locations)) {
                loc2.marker.setStyle({
                    fillOpacity: theme.opacity.enable
                });
            }
        });

    }

    _bringLatestToFront();
}



function SetObjectEvents(cases, locations, myMap) {
    var cases = window.cases;
    var locations = window.locations;
    var myMap = window.myMap;
        
    function _jumpToLocation(locName) {
        var marker = locations[locName].marker;
        
        //myMap.panTo(marker.getLatLng());
        myMap.flyTo(marker.getLatLng(), 12);
        marker.openPopup();  
    }

    function _caseNoClick() {
        var caseNo = $(this).attr("no");

        if (window.pickedCases.includes(caseNo))
            window.isSamePool = true;
        
        if (window.sidebar < 0)
            toggleSidebar();
    
        // we jump to the node of this case
        var locNames = cases[caseNo].locNames;
        // check if this case has node on map
        if (locNames.length > 0) {
            // zoom to first node
            _jumpToLocation(locNames[0]);
        }
    }

    $(document).on("click", ".location", function() {
        var locName = $(this).attr("loc");
    
        if (window.pickedMarker.includes(locName))
            window.isSamePool = true;

        _jumpToLocation(locName);
    });
    
    $(document).on("click", ".a-link-case", _caseNoClick);
    $(document).on("click", ".case-container", _caseNoClick);
}

