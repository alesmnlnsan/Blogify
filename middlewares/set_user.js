const db = require('../db')

function setUser(req, res, next) {
  res.locals.user_Id = req.session.user_Id;

  if (!req.session.user_Id) {
      next();
      return;
  }

  let sql = `SELECT * FROM users WHERE user_id = $1;`;
  db.query(sql, [req.session.user_Id], (err, dbRes) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Database error.');
      }
      res.locals.user = dbRes.rows[0];
      next();
  });
}

module.exports = setUser