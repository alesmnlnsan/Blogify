const express = require('express')
const router = express.Router()
const db = require('../db')
const ensuredLoggedIn = require('../middlewares/ensured_logged_in')
const format = require('date-fns/format')

router.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts;', (err, dbRes) => {
    if (err) {
      console.log(err);
    } else {
      const posts = dbRes.rows;
      res.render('posts', { posts: dbRes.rows, format });
      console.log(dbRes.rows);
    }
  });
});

router.get('/posts/create', (req, res) => {
  // console.log('req.session', req.session)
  res.render('new_blog')
})

router.get('/posts/:id', (req, res) => {
  let sql = `
    SELECT * FROM posts
    WHERE post_id = $1;
    `
  db.query(sql, [req.params.id], (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    let post = dbRes.rows[0]
    console.log('post', post)
    res.render("show", { post: post, format })
  })
})

router.post('/posts', ensuredLoggedIn, (req, res) => {
  let title = req.body.title
  let imageUrl = req.body.image
  let content = req.body.content

  const sql = `INSERT INTO posts (title, image_url, content, publication_date) 
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
          RETURNING post_id;
        `

  db.query(sql, [title, imageUrl, content], (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    console.log('dbRes', dbRes)
    res.redirect(`/posts/${dbRes.rows[0].post_id}`)
  })

})

router.get('/posts/:id/edit', (req, res) => {
  const sql = `
    SELECT * 
    FROM posts
    WHERE id = $1;
    `

  db.query(sql, [req.params.post_id], (err, dbRes) => {
    let post = dbRes.rows[0]
    res.render('edit', { post: post })
  })
})

router.put('/posts/:id', (req, res) => {

  const sql = `
      UPDATE posts 
      SET title = $1, image_url = $2, content = $3
      WHERE id = $3;`

  db.query(sql, [req.body.title, req.body.image_url, req.params.id], (err, dbRes) => {
    res.redirect(`/posts/${req.params.id}`)
  })

})


//other pages of the blog website
router.get('/about', function (req, res) {
  res.render('about');
});

router.get('/contact', function (req, res) {
  res.render('contact');
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const sql = `
    INSERT INTO contacts (name, email, message)
    VALUES ($1, $2, $3)
    RETURNING id;
  `;

  db.query(sql, [name, email, message], (err, dbRes) => {
    if (err) {
      console.log(err);
      return;
    }

    const contactId = dbRes.rows[0].id;
    console.log(`Inserted contact with ID: ${contactId}`);
    res.status(200).send('Form submitted successfully');
  });
});


module.exports = router