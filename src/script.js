const key = 'ff9ba92f56ed4ed0b1edf0bc8a23b311'

function getLoc() {
    function f(pos) {alert(pos.coords); return pos.coords}
    navigator.geolocation.getCurrentPosition(f)
}

function get() {
    
}