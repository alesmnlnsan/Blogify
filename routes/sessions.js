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
    console.log('user data', user)
    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password_digest, (err, result) => {
      console.log(err, result)
      if (err) {
        console.error(err);
        return res.status(500).send('Internal error.');
      }
      console.log('login flow')
      // console.log(dbRes.rows[0])
      if (result) {
        console.log('login flow res', result)
        req.session.user_id = user.user_id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.pronouns = user.pronouns;
        return res.redirect('/profile');
      } else {
        return res.render('login', { error: 'Invalid email or password' });
      }
    });
  });
});


//--------------------------++ PROFILE

router.get('/profile', (req, res) => {
  const userId = req.session.user_id;
  // console.log('loc', res.locals.user_id)
  // console.log('userId', userId)
  const sql = `
    SELECT *
    FROM posts
    WHERE author_id = $1;
  `;

  db.query(sql, [userId], (err, dbRes) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }
    const user = {
      username: req.session.username,
      email: req.session.email,
      pronouns: req.session.pronouns,
    }

    const posts = dbRes.rows;
    console.log(posts)
    res.render('profile', { posts, user });
  });
});

//------------------------++ LOGOUT

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to log out.');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

//------------------------++ SIGNUP

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