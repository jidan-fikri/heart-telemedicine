document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("hubungkan").addEventListener("click", hubungkan);
})

function hubungkan() {
    navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["19b10010-e8f2-537e-4f6c-d104768a1214"]
        })
        .then(device => {
            // hubungkan device
            return device.gatt.connect();
        })
        .then(server => {
            // dapatkan service data
            return server.getPrimaryService();
        })
}