const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get("/login", (req, res) => {
    if(err) {
        console.log(err)
    }
  res.render('login');
});

router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let sql = `SELECT * FROM users WHERE email = $1;`;

  db.query(sql, [email], (err, dbRes) => {
    if (err) {
      console.log(err);
    }

    if (dbRes.rows.length === 0) {
      res.render("login");
      return;
    }

    // check your password
    bcrypt.compare(password, dbRes.rows[0].password_digest, (err, result) => {
      if (err) {
        console.log(err);
      }

      if (result) {
        req.session.userId = dbRes.rows[0].id;
        res.redirect('/');
      } else {
        res.render("login");
      }
    });
  });
});

router.delete("/logout", (req, res) => {
  req.session.userId = undefined;
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

// Export the router
module.exports = router;
