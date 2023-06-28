const express = require('express');
const router = express.Router();
const db = require('../db')

router.get('/', (req, res) => {
    db.query('SELECT * FROM posts;', (err, dbRes) => {
      if (err) {
        console.log(err);
      } else {
        const posts = dbRes.rows;
        res.render('home', { posts: dbRes.rows });
        console.log(dbRes.rows);
      }
    });
  });
  
  module.exports = router