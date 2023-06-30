const express = require('express')
const router = express.Router()
const db = require('../db')
const ensuredLoggedIn = require('../middlewares/ensured_logged_in')


module.exports = router