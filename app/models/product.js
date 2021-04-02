const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {type: String, require: true},
    image: {type: String, require: true},
    price: {type: Number, require: true},
    type: {type: String, require: true}
})

const product = mongoose.model('product', productSchema)

module.exports = product