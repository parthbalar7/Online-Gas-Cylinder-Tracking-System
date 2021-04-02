const Order = require('../../../models/order')

function deliveryController() {
    return {
        assign(req, res) {
            console.log(req.body)
            Order.updateOne({_id: req.body.orderId}, { did: req.body.did }, (err, data)=> {
                if(err) {
                    console.log(err)
                    return res.redirect('/admin/orders')
                }
                // Emit event 
             //   const eventEmitter = req.app.get('eventEmitter')
             //   eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        }
    }
}

module.exports = deliveryController