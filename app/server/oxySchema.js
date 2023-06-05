const mongoose = require('mongoose');
const { Schema } = mongoose;

const oxySchema = new Schema({
    value: Number, // String is shorthand for {type: String}
}, { timestamps: true });

const oxy = mongoose.model('oxy', oxySchema);
module.exports = oxy;