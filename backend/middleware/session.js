module.export = (req,res,next) => {
    if(req.session.userInfo) {
        res.send("login success!");
        next();
        
    }    
    
}