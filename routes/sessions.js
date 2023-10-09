const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const format = require('date-fns/format')
const ensuredLoggedIn = require('../middlewares/ensured_logged_in')

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT * FROM users WHERE email = $1;';
  db.query(sql, [email], (err, dbRes) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error:' + err.message);
    }

    const user = dbRes.rows[0];

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password_digest, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal error.');
      }

      if (result) {
        req.session.user_id = user.user_id;
        return res.redirect('/profile');
      } else {
        return res.render('login', { error: 'Invalid email or password' });
      }
    });
  });
});


router.get('/profile', ensuredLoggedIn, (req, res) => {
  const userId = req.session.user_id;
  console.log('userId', userId)
  const sql = 'SELECT * FROM users WHERE user_id = $1;';
  db.query(sql, [userId], (err, dbRes) => {
    if (err) {
      console.log('err', err);
      return;
    }
    const sqlPosts = 'SELECT * FROM posts WHERE author_id = $1;';
    db.query(sqlPosts, [userId], (errPosts, dbResPosts) => {
      if (errPosts) {
        console.log('errPosts', errPosts);
        return;
      }
      const user = dbRes.rows[0];
      const posts = dbResPosts.rows;
      console.log(posts.length)
      res.render('profile', { user: user, posts: posts, format });
    })
  });
});


router.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Failed to log out.');
      }
      res.redirect('/login');
  });
});


router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const pronouns = req.body.pronouns;

  if (!password) {
    return res.status(400).send('Password is required.');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Hashing error during signup.');
    }

    const sql = 'INSERT INTO users (username, email, password_digest, pronouns) VALUES ($1, $2, $3, $4);';
    db.query(sql, [username, email, hashedPassword, pronouns], (err, dbRes) => {
      if (err) {
        console.error("Signup error:", err);
        return res.status(500).send('Database error during signup.');
      }
      res.redirect('/login');
    });
  });
});



module.exports = router;