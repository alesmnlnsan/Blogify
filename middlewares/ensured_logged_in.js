function ensuredLoggedIn(req, res, next) {
  console.log('req',req.session)
    if (req.session.user_id) {
      return next()
    }
  
    res.redirect("/login")
  }
  
  
  module.exports = ensuredLoggedIn