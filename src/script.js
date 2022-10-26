const key = 'ff9ba92f56ed4ed0b1edf0bc8a23b311'
var position
var address
var destAddress

const CALocations = [ // hardcoded lat/long/addresses for each red cross location because CORS is cringe and im also new to http reqs
    // Central CA
    [34.1986343, -119.0076775, "836 Calle Plano, Camarillo, CA 93012"],
    [35.389395, -119.05817, "5035 Gilmore Ave, Bakersfield, CA 93308"],
    [36.808730, -119.815910, "1300 W. Shaw Ave. Suite 4B, Fresno, CA 93711"],
    [36.330370, -119.293780, "208 West Main Street, Suite B, Visalia, CA 93291"],
    [34.437460, -119.724120, "2707 State St, Santa Barbara, CA 93105"],
    [35.2537677, -120.6667043, "225 Prado Road, #A, San Luis Obispo, CA 93401"],

    // SoCal
    [32.8136695, -117.1234455, "3950 Calle Fortunada, San Diego, CA 92123"],
    [33.7502764, -117.8366395, "600 Parkcenter Dr. Santa Ana, CA 92705"],
    [33.9383977, -117.2926879, "6235 River Crest Drive, Suite A, Riverside, CA 92507"],
    [33.7239724, -116.4005887, "72559 CA-Highway 111, Palm Desert, CA 92260"],
    [32.790238, -115.5616528, "312 South 8th St. El Centro, CA 92243"],
    [34.0813705, -117.5730742, "10600 Trademark Parkway, Suite 406, Rancho Cucamonga, CA 91730"],
    [34.240181, -116.0696067, "Building 693, Del Valle Dr Suite 102, Twentynine Palms, CA 92278"],
    [35.2576368, -116.6958491, "1204 Normandy Dr., Fort Irwin, CA 92310"],

    // Gold Country
    [39.1620492, -121.6341279, "2125 East Onstott Road, Yuba City, CA 95991"],
    [38.5960976, -121.4348304, "1565 Exposition Blvd, Sacramento, CA 95815"],

    // CA Coastal
    [37.7730885, -122.4215206, "1663 Market Street, San Francisco, CA 94103"],
    [37.9528651, -121.2930412, "65 North Commerce St., Stockton, CA 95202"],
    [36.5525479, -121.9226758, "Eighth Ave. at Dolores St., Carmel, CA 93921"],
    [38.5107066, -122.7655165, "5297 Aero Drive, Santa Rosa, CA 95403"],
    [37.3902468, -121.9321192, "2731 North 1st St. ,San Jose, CA 95134"],

    // LA
    [34.0278061, -118.24725, "1450 South Central Ave, Los Angeles, CA 90021"],
    [33.8067791, -118.1542495, "3150 East 29th Street, Long Beach, CA 90806"],
    [34.0204691, -118.4875316, "1450 11th Street, Santa Monica, CA 90401"],
    [34.1331676, -118.0435469, "376 W Huntington Dr, Arcadia, CA 91007"],
    [34.1273773, -118.2552752, "1501 S Brand Blvd, Glendale, CA 91204"],
]

function haversineDistance(coords1, coords2, isMiles) { // formula for finding distance between two coordinates
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    if (isMiles) d /= 1.60934;

    return d;
}

function getLoc(loc) {
    if (!loc) {
        navigator.geolocation.getCurrentPosition((pos) => {
            position = pos.coords
            getAddress();
        })
    }
}

function getAddress() {
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${position.latitude}&lon=${position.longitude}&apiKey=${key}`)
        .then(response => response.json())
        .then(result => {
            if (result.features.length) {
                address = encodeURIComponent((result.features[0].properties.formatted).split(";")[1])
                getLocation(position.latitude, position.longitude)
            } else {
                console.log("No address found");
                address = `loc:${position.latitude}+${position.longitude}`
                getLocation()
            }
        })
}

function getLocation(lat, long) {
    var closest = CALocations[0]
    var closestDist = haversineDistance([long, lat], [closest[1], closest[0]], true)

    for (let index = 1; index < CALocations.length; index++) {
        const coords = CALocations[index];
        var dist = haversineDistance([long, lat], [coords[1], coords[0]], true)

        if (dist < closestDist) { closest = coords }
    }

    redirect(address, closest[2])
}

function redirect(address, destAddress) {
    var url = `https://www.google.com/maps/dir/?api=1&origin=${address}&destination=${encodeURIComponent(destAddress)}`
    console.log(url)
    window.open(url)
}

function get() {
    getLoc()
}

document.getElementById("search").addEventListener("click", get.bind())