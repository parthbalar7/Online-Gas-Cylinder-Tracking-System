const product = require('../../models/product')

function homeController() {
    return {
        async index(req,res){
            const items = await product.find()
            return res.render('home', {items:items})
        },
        async cylinders(req,res){
            const items = await product.find({type: { $eq : 'cylinder' }})
            return res.render('home', {items:items})
        },
        async equipments(req,res){
            const items = await product.find({type: { $eq : 'equipment' }})
            return res.render('home', { items:items })
        }
        }
    }

module.exports = homeController