const key = 'ff9ba92f56ed4ed0b1edf0bc8a23b311'

function getLoc() {
    navigator.geolocation.getCurrentPosition((function(pos) {alert(pos.coords); return pos.coords}).bind(window))
}

function get() {
    
}