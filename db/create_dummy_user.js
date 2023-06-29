require('dotenv').config()
const db = require('./index.js')
const bcrypt = require('bcrypt')

let email = 'johndoe@example'
let plainTextPassword = 'password'
let saltRounds = 10

bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        console.log('hash', hash)

        let sql = `
        INSERT INTO users (email, password_digest)
        VALUES ('${email}', '${hash}');
        `

        db.query(sql, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                console.log('new user created')
            }
        })
    })
})

