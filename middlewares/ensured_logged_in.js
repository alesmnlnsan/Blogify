const flash = require('connect-flash');

function ensuredLoggedIn(req, res, next) {
  if (req.session.user_id) {
    return next();
  }

  req.flash('error', 'You must be logged in to access this page.');
  res.redirect('/login');
}

module.exports = ensuredLoggedIn;