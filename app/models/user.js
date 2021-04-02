const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String , require: true},
    role : {type: String, default:'customer'},
    uid : { type: String, default:'' },
    address : { type: String, default:'' },
    area : { type: String, default:'' },
    lpgId : { type: String, default:'' },
    phone : { type: String, default:'' }
}, {timestamps: true })

module.exports = mongoose.model('User', userSchema)