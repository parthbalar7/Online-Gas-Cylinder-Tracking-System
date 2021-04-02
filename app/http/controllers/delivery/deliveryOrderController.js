const Order = require('../../../models/order')


function deliveryOrderController(){
    return {
        index(req,res){
            const id = req.user.uid
            Order.find({did : { $eq : id }, status : { $ne : 'completed'}}, null, {sort: {'createdAt': -1}}).populate('customerId','-password').exec((err,orders)=>{
                    if(req.xhr) {
                    return res.json(orders)
                }
                res.render('delivery/orders')
            })
        }
    }
}

module.exports = deliveryOrderController