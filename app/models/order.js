const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true 
    },
    items: {type: Object, required: true },
    phone: {type: String, required: true},
    lpgId: {type: String, required: true},
    address: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    area: {type: String, required: true},
    cyQty: {type: Number, required: true},
    eqQty: {type: Number, required: true},
    paymentType: {type: String, default:'COD'},
    status: {type: String, default:'order_placed'},
    did: {type: String, default:''},
    deliveryPhone: {type: String, default: ''},
    paymentStatus: {type: String, default:'Not Paid'}
}, {timestamps: true })

module.exports = mongoose.model('Order', orderSchema)