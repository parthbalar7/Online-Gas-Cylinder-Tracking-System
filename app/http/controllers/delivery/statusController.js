const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            if(req.body.status === 'completed'){
                Order.updateOne({_id: req.body.orderId}, {paymentStatus : 'Paid'}, function(err,res) {
                    if (err){ 
                        console.log(err) 
                    } 
                    else{ 
                        console.log(res); 
                    } 
                })
            }
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    return res.redirect('/delivery/orders')
                }
                // Emit event 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/delivery/orders')
            })
        }
    }
}

module.exports = statusController