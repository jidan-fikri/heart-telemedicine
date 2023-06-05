const mongoose = require('mongoose');
const { Schema } = mongoose;

const ecgSchema = new Schema({
    value: Number, // String is shorthand for {type: String}
}, { timestamps: true });

const ecg = mongoose.model('ecg', ecgSchema);
module.exports = ecg;