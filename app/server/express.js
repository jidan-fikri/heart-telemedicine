const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const router = express.Router();
const { main } = require('./database')
const ecg = require('./ecgSchema');
const oxy = require('./oxySchema');
const mongoose = require('mongoose');

app.use(cors())

router.get('/', async function(req, res) {
    let response = await ecg.find().sort({ createdAt: -1 }).limit(540);
    res.status(200).json(response);
    //__dirname : It will resolve to your project folder.
});

router.get('/oxy', async function(req, res) {
    let response = await oxy.findOne().sort({ createdAt: -1 });
    res.status(200).json(response);
    //__dirname : It will resolve to your project folder.
});

app.use('/', router);
mongoose.connect('mongodb://127.0.0.1:27017/Mahasiswa');
main();
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');