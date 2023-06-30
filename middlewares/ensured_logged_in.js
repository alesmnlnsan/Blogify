function ensuredLoggedIn(req, res, next) {
    console.log('req',req.session)
      if (req.session.user_Id) {
        return next()
      }
    
      res.redirect("/login")
    }
    
    
    module.exports = ensuredLoggedIn
    