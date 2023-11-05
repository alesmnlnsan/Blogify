const express = require('express');
const router = express.Router();
// const db = require('../db')

router.get('/', (req, res) => {
  const user = {
    username: req.session.username,
    email: req.session.email,
    pronouns: req.session.pronouns,
  }

  res.render('home', { user });
});

module.exports = router