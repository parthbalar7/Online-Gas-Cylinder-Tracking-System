const order = require('../../../models/order')
const Order = require('../../../models/order')

function reportController() {
    return {
        async index(req, res){
            if(req.query.search){
                const regex = req.query.search
                const order = await Order.find({area: {$regex: regex, $options:"i"}},null, {sort: {'createdAt': -1} }).populate('customerId','-password')
                res.render('admin/report', {orders : order})
            }else{
                const order = await Order.find(null, null ,{sort: {'createdAt': -1} }).populate('customerId','-password')
                res.render('admin/report', {orders : order})
            }
        }
    }
}

module.exports = reportController