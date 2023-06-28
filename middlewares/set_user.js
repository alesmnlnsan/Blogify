const db = require('../db')

function setUser(req, res, next) {

  res.locals.user_Id = req.session.user_Id

  if (!req.session.user_Id) {
    next()
    return
  }

  let sql = `SELECT * FROM users WHERE id = ${req.session.user_Id};`

  db.query(sql, (err, dbRes) => {
    if (err) {
      console.log(err)
    } else {
      res.locals.user = dbRes.rows[0]
    }

    next()  
  })

}

module.exports = setUser