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
