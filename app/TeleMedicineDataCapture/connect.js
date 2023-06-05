const serviceUuid = "19b10000-e8f2-537e-4f6c-d104768a1214";

var MQTT_CLIENT_ID = "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
var client = mqtt.connect("ws://broker.mqttdashboard.com:8000/mqtt", MQTT_CLIENT_ID);

let ecgCharacteristic;
let oxyCharacteristic;
let ecgValue = 0;
let oxyValue = 0;
let myBLE;
let isConnected = false;
let isRunning = true;
let hitungByte = 0;
// const dataSementara = [];

function setup() {
    myBLE = new p5ble();
    const readButton = document.getElementById("mulai").addEventListener("click", read)
    const stopButton = document.getElementById("hentikan").addEventListener("click", stop)
    document.getElementById("data").innerHTML = "hubungkan";
}


async function stop() {
    isRunning = false;
    isConnected = false;
    await myBLE.disconnect();
    document.getElementById("data").innerHTML = "hubungkan";
    // let total = dataSementara.length * 4;
    // dataSementara.push(`memory size = ${total} byte`);

    // let content = dataSementara;

    // const link = document.createElement("a");
    // const file = new Blob([content], { type: 'text/plain' });
    // link.href = URL.createObjectURL(file);
    // link.download = "sample.txt";
    // link.click();
    // URL.revokeObjectURL(link.href);
}

async function read() {
    isRunning = true;
    if (!isConnected) {
        const characteristics = await myBLE.connect(serviceUuid);
        console.log('characteristics: ', characteristics[0]);
        console.log('characteristics: ', characteristics[1]);
        ecgCharacteristic = characteristics[0];
        oxyCharacteristic = characteristics[1];
        isConnected = true;
    }
    document.getElementById("data").innerHTML = "sedang mengambil data";

    while (isRunning && isConnected) {
        ecgValue = await myBLE.read(ecgCharacteristic, 'int');
        oxyValue = await myBLE.read(oxyCharacteristic, 'int');
        // dataSementara.push(myValue);
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
        console.log(`${time}` + " ecg: " + ecgValue + " spo2: " + oxyValue);
        // console.log(`${time}` + " ecg: " + ecgValue);

        await client.publish("halo/test/ecg", `${ecgValue}`);
        await client.publish("halo/test/oxy", `${oxyValue}`);
    }
}