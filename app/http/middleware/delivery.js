function auth(req,res,next){
    if(req.isAuthenticated() && req.user.role === 'delivery'){
        return next()
    }
    return res.redirect('/')
}

module.exports = auth