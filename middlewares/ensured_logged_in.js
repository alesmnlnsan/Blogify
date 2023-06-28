
function ensuredLoggedIn(req, res, next) {
    if (req.session.user_Id) {
      return next()
    }
  
    res.redirect("/login")
  }
  
  
  module.exports = ensuredLoggedIn