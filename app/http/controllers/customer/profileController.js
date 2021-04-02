const User = require('../../../models/user')
function profileController () {
    return {
         index(req,res){
            return res.render('./customers/profile')
        },
        store(req,res){
            const  {name, phone,email, address, area, lpgId } = req.body
            

            User.updateOne({_id: req.user.id}, {lpgId : lpgId}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            User.updateOne({_id: req.user.id}, {area : area}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            User.updateOne({_id: req.user.id}, {address : address}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            User.updateOne({_id: req.user.id}, {email : email}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            User.updateOne({_id: req.user.id}, {phone : phone}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            User.updateOne({_id: req.user.id}, {name : name}, function(err,res) {
                if (err){ 
                    console.log(err) 
                } 
                else{ 
                    console.log(res); 
                } 
            })
            
            req.flash('name', name)
            req.flash('email', email)
            req.flash('area', area)
            req.flash('phone', phone)
            req.flash('lpgId', lpgId )
            req.flash('address', address)

            res.redirect('/profile')
            }
        }
    }

module.exports = profileController