const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req,res){
            //validate request
            const  {phone, lpgId, address, area } = req.body    
            if(!phone || !lpgId || !address || !area ){
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }
            let parsedItems = Object.values(req.session.cart.items)
            let cyQty = 0
            let eqQty = 0
            for (let value of parsedItems) {
                if(value.item.type == 'cylinder'){
                     cyQty = value.qty + cyQty
                }
                if(value.item.type == 'equipment'){
                     eqQty = value.qty + eqQty
                }
              }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                totalPrice: req.session.cart.totalPrice,
                phone,
                lpgId,
                cyQty,
                eqQty,
                address,
                area
            })

            order.save().then(result => {
                req.flash('success', 'Order placed sucessfully')
                delete req.session.cart 

                return res.redirect('/customer/orders')
            }).catch(err => {
                req.flash('error','something went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await Order.find({ customerId: req.user._id }, 
                null, 
                {sort: { 'createdAt': -1 }})
                res.header('cache-control', 'no-cache, private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0')
            res.render('customers/orders', { orders : orders , moment: moment })
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)
            // authorize
            if(req.user._id.toString() === order.customerId.toString()){
               return  res.render('./customers/singleOrder', {order})
            } 
            
            return res.redirect('/')
            
        }
    }
}

module.exports = orderController