const db = require('../db')

function setUser(req, res, next) {
  res.locals.user_id = req.session.user_id;
  res.locals.user = null;
  console.log('Session user_id:', req.session.user_id);


  if (!req.session.user_Id) {
      next();
      return;
  }

  let sql = `SELECT * FROM users WHERE user_id = $1;`;
  db.query(sql, [req.session.user_id], (err, dbRes) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Database error.');
      }
      res.locals.user = dbRes.rows[0];
      next();
  });
}

module.exports = setUser