const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT * FROM users WHERE email = $1;';
  db.query(sql, [email], (err, dbRes) => {
    if (err) {
      console.log(err);
      return;
    }

    if (dbRes.rows.length === 0) {
      res.render('login');
      return;
    }

    bcrypt.compare(password, dbRes.rows[0].password_digest, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      if (result) {
        req.session.user_Id = dbRes.rows[0].user_id;
        res.redirect('/profile');
      } else {
        res.render('login');
      }
    });
  });
});

router.get('/profile', (req, res) => {
    const userId = req.session.user_Id;
  
    const sql = 'SELECT * FROM users WHERE user_id = $1;';
    db.query(sql, [userId], (err, dbRes) => {
        if (err) {
            console.log(err);
            return;
        }
  
        const user = dbRes.rows[0];
        const posts = dbRes.rows;
  
        res.render('profile', { user: user, posts: posts });
    });
});

  
router.delete('/logout', (req, res) => {
  req.session.user_Id = undefined;
  res.redirect('/login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const pronouns = req.body.pronouns;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      return;
    }

    const sql = 'INSERT INTO users (username, email, password_digest, pronouns) VALUES ($1, $2, $3, $4);';
    db.query(sql, [username, email, hashedPassword, pronouns], (err, dbRes) => {
      if (err) {
        console.log(err);
        return;
      }

      res.redirect('/login');
    });
  });
});

// Export the router
module.exports = router;
