module.exports.isLoggedin= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("you must login for this service");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl= req.session.redirectUrl ;
    }
    next();
}