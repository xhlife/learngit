const mongoose = require("mongoose")
const Schema = mongoose.Schema
const arch = new Schema({
    houseId: {
        type: String,
        unique: true,
        require: true
    },
    crops: {
        type: String,
        require: true
    },
    temperature: {
        top: { type: String, require: true},
        low: { type: String, require: true},
        suitable: {type: String, require: true}
    },
    light: {
        top: { type: String, require: true },
        low: { type: String, require: true },
        suitable: { type: String, require: true }
    },
    humidity: {
        top: { type: String, require: true },
        low: { type: String, require: true },
        suitable: { type: String, require: true }
    },
})

module.exports = mongoose.model('arch', arch)
