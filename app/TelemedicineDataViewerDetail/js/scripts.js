$(function() {
    $('#update').click(function() {
        location.reload();
    });
    simpanData = [];
    $.get("http://localhost:3000/").success(function(data) {
        for (let i = 0; i < data.length; i++) {
            simpanData.push((data[i]['value']));
        }

        ecg = [];

        // for (i = 0; i < data.length; i++) {
        //     for (j = 0; j < data[i].length; j++) {
        //         ecg[i].push({
        //             x: j,
        //             y: data[i][j]
        //         });
        //     }
        // }
        for (let i = 0; i < simpanData.length; i++) {
            ecg.push({
                x: i,
                y: simpanData[i]
            });
        }
        console.log(ecg);

        options = {
            ticks: {
                x: 22,
                y: 8
            },
            width: 400,
            height: 150
        }

        for (let i = 0; i <= 11; i++) {
            $(`.ecg_container${i}`).ecgChart(ecg, options);
        }

    });
    var MQTT_CLIENT_ID = "iot_web_" + Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
    var client = mqtt.connect("ws://broker.mqttdashboard.com:8000/mqtt", MQTT_CLIENT_ID);
    client.on('connect', function() {
        console.log('Connected');
        $.get("http://localhost:3000/oxy").success(function(data) {
            $('#spo2').text(data['value']);
        });
    });
    client.subscribe('halo/test/oxy', function(err) {
        console.log(err);
    });
    client.on('message', async function(topic, message) {
        $('#spo2').text(await parseFloat(message.toString()));
    });
});