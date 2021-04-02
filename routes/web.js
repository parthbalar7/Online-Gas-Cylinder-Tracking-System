const authController = require("../app/http/controllers/authController")
const homeController = require("../app/http/controllers/homeController")
const cartController = require("../app/http/controllers/customer/cartController")
const orderController = require("../app/http/controllers/customer/orderController")
const AdminOrderController = require("../app/http/controllers/admin/orderController")
const reportController = require("../app/http/controllers/admin/reportController")
const employeeController = require("../app/http/controllers/admin/employeeController")
const deliveryController = require("../app/http/controllers/admin/deliveryController")
const profileController = require("../app/http/controllers/customer/profileController")
const deliveryOrderController = require("../app/http/controllers/delivery/deliveryOrderController")
const statusController = require("../app/http/controllers/delivery/statusController")
//middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')
const delivery = require('../app/http/middleware/delivery')



function initRoutes(app) {
    

    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)

    app.get('/register', guest, authController().register) 
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    app.get('/remove-cart',cartController().emptyCart)

    //customer routes
    app.post('/orders', auth , orderController().store)
    app.get('/customer/orders', auth ,  orderController().index)
    app.get('/cylinders', homeController().cylinders)
    app.get('/equipments', homeController().equipments)
    app.get('/', homeController().index)
    app.get('/profile',auth, profileController().index)
    app.post('/profile',auth , profileController().store)
    app.get('/customer/order/:id',auth, orderController().show)

    //admin routes
    app.get('/admin/orders',admin ,  AdminOrderController().index)
    app.get('/report',admin , reportController().index)
    app.get('/register/employee',admin , authController().getEmployeeRegister)
    app.post('/register/employee',admin , authController().postEmployeeRegister)
    app.get('/employee',admin , employeeController().index)
    app.post('/admin/delivery',admin , deliveryController().assign)
    app.post('/remove-employee',admin , employeeController().delete)

    //delivery person routes
    app.get('/delivery/orders',delivery,  deliveryOrderController().index)
    app.post('/delivery/order/status',delivery, statusController().update)
}

module.exports = initRoutes