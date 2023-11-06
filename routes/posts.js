const express = require('express')
const router = express.Router()
const db = require('../db')
const ensuredLoggedIn = require('../middlewares/ensured_logged_in')
const format = require('date-fns/format')

router.get('/posts', (req, res) => {
  const sql = `
      SELECT posts.*, users.username AS author_name 
      FROM posts 
      JOIN users ON posts.author_id = users.user_id;
  `;

  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err);
      return;
    }
    const posts = dbRes.rows;

    const user = {
      username: req.session.username,
      email: req.session.email,
      pronouns: req.session.pronouns,
    }

    console.log('sess', req.session)
    res.render('posts', { posts: posts, user, format });
  });
});


router.get('/posts/create', (req, res) => {
  // console.log('req.session', req.session)
  res.render('new_blog')
})

router.get('/posts/:id', (req, res) => {
  const postId = req.params.id;

  const sqlPost = `SELECT * FROM posts WHERE post_id = $1`;
  db.query(sqlPost, [postId], (err, dbRes) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }

    const post = dbRes.rows[0];

    if (!post) {
      return res.status(404).send('Post not found.');
    }

    const sqlComments = `SELECT * FROM comments WHERE post_id = $1`;
    db.query(sqlComments, [postId], (err, dbRes) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error.');
      }

      const comments = dbRes.rows;

      res.render('single-post', { post, comments });
    });
  });
});

router.post('/posts', ensuredLoggedIn, (req, res) => {
  let title = req.body.title
  let imageUrl = req.body.image
  let content = req.body.content
  let userId = req.session.user_id;
  // console.log('userId', userId, content)
  const sql = `INSERT INTO posts (title, image_url, content, publication_date, author_id) 
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
          RETURNING post_id;
        `

  db.query(sql, [title, imageUrl, content, userId], (err, dbRes) => {
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
    WHERE post_id = $1;
    `

  console.log('req.params.id', req.params.id)

  db.query(sql, [req.params.id], (err, dbRes) => {
    let post = dbRes.rows[0]
    res.render('edit', { post: post })
  })
})

router.put('/posts/:id', (req, res) => {
  const sql = `
    UPDATE posts 
    SET title = $1, image_url = $2, content = $3
    WHERE post_id = $4;
  `;

  db.query(sql, [req.body.title, req.body.image_url, req.body.content, req.params.id], (err, dbRes) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error.');
    }

    res.redirect(`/posts/${req.params.id}`);
  });
});

router.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;

  const sql = 'DELETE FROM posts WHERE post_id = $1;';
  db.query(sql, [postId], (err, dbRes) => {
    res.redirect('/profile')
  });
});

router.post('/comment', ensuredLoggedIn, (req, res) => {
  const postId = req.body.postId;
  const content = req.body.content;
  const userId = req.session.user_id;
  const username = req.session.username; // Make sure the session stores the username

  const userSql = `
  SELECT * FROM users 
  WHERE user_id = $1;
  `;

  db.query(userSql, [userId], (errUser, dbResUser) => {
    if (errUser) {
      console.log(errUser)
      return
    }
    const user = dbResUser.rows[0];

    console.log('user', user)

  const sql = `
      INSERT INTO comments (post_id, user_id, username, comment_text, comment_date)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
  `;

  db.query(sql, [postId, userId, username, content], (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect(`/posts/${postId}`);
  });
});


//other pages of the blog website
router.get('/about', function (req, res) {
  const user = {
    username: req.session.username,
    email: req.session.email,
    pronouns: req.session.pronouns,
  }
  res.render('about', { user });
});

router.get('/contact', function (req, res) {
  const user = {
    username: req.session.username,
    email: req.session.email,
    pronouns: req.session.pronouns,
  }
  res.render('contact', { user });
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
}); 


module.exports = router