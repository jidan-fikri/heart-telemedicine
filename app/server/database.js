const mqtt = require('mqtt')
const ecg = require('./ecgSchema');
const oxy = require('./oxySchema');

const client = mqtt.connect('mqtt://broker.hivemq.com')

const main = async() => {
    client.on('connect', function() {
        console.log('Connected')
        client.subscribe('halo/test/ecg', function(err) {
            console.log(err);
        });
        client.subscribe('halo/test/oxy', function(err) {
            console.log(err);
        });
    })
    client.on('message', function(topic, message) {
        let simpan = 0;
        setTimeout(async function() {
            if (topic === 'halo/test/ecg') {
                simpan = await ecg.create({ value: parseFloat(message.toString()) });
            }
            if (topic === 'halo/test/oxy') {
                simpan = await oxy.create({ value: parseFloat(message.toString()) });
            }
        });

    })
}
main()