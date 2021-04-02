const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
var shortid = require('shortid')

function authController() {
    const _getRedirectUrl = (req) => {
        if(req.user.role == 'delivery')
        {
            return '/delivery/orders'
        } else {
            return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
        }
    }

    return {
        login(req,res){
            res.render('auth/login')
        },
        postLogin(req,res,next){
            const {email, password }   = req.body
            // Validate request 
            if(!email || !password) {
               req.flash('error', 'All fields are required!')
               return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error',info.message)
                    return res.redirect('/login') 
                }
                req.logIn(user, (err)=>{
                    if(err){
                        req.flash('error',info.message)
                        return next(err)
                    }

                    res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req,res){
            res.render('auth/register')
        },
        async postRegister(req, res){
            const { name, phone, email,  password, confirmPassword }   = req.body
            // Validate request 
            if(!name || !email || !phone || !password || !confirmPassword) {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('phone', phone)
                req.flash('email', email)
                
               return res.redirect('/register')
            }
            if(password != confirmPassword){
                req.flash('error', 'Password and confirm password not same!')
                req.flash('name', name)
                req.flash('phone', phone)
                req.flash('email', email)
                
               return res.redirect('/register')
            }
   
            // Check if email exists 
            User.exists({ email: email }, (err, result) => {
                if(result) {
                   req.flash('error', 'Email already taken!')
                   req.flash('name', name)
                   return res.redirect('/register')
                }
            })
   
            // Hash password 
            const hashedPassword = await bcrypt.hash(password, 10)
            // Create a user 
            const user = new User({
                name,
                phone,
                email,
                password: hashedPassword
            })
   
            user.save().then((user) => {
               // Login
               return res.redirect('/login')
            }).catch(err => {
               req.flash('error', 'oops! Something went wrong')
               console.log(err)
                   return res.redirect('/register')

            })
        },

        getEmployeeRegister(req,res){
            res.render('./admin/employee')
        },

        async postEmployeeRegister(req, res){
            const { name, email, password, phone }   = req.body
            // Validate request 
            if(!name || !email || !password || !phone) {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('email', email)
               return res.redirect('/register/employee')
            }
   
            // Check if email exists 
            User.exists({ email: email }, (err, result) => {
                if(result) {
                   req.flash('error', 'Email already taken!')
                   req.flash('name', name) 
                   return res.redirect('/register/employee')
                }
            })

   
            // Hash password 
            const hashedPassword = await bcrypt.hash(password, 10)
            const uid = shortid.generate()
            // Create a user 
            const user = new User({
                name,
                email,
                phone,
                uid: uid,
                role: 'delivery',
                password: hashedPassword
            })
   
            user.save().then((user) => {
               // Login
               return res.redirect('/employee')
            }).catch(err => {
               req.flash('error', 'oops! Something went wrong')
               console.log(err)
                   return res.redirect('/register/employee')

            })
        },
        logout(req,res){
            req.logout()
            delete req.session.cart
            return res.redirect('/login')
        }
    }
}

module.exports = authController