const BingMapsKey = 'ff9ba92f56ed4ed0b1edf0bc8a23b311'

function getLoc() {
    var location
    navigator.geolocation.getCurrentPosition((function(pos) {location = pos.coords}).bind(window))
    console.。log(location)
    return location
}

function get() {
    
}