require('dotenv').config()

const express = require('express');
const app = express();
const port = process.env.PORT || 3000

const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')
const todosRouter = require('./routes/todos')
const sessionsRouter = require('./routes/sessions')

const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const session = require('express-session')

const setUser = require('./middlewares/set_user')
const ensuredLoggedIn = require('./middlewares/ensured_logged_in')
const requestLogger = require('./middlewares/request_logger')


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}))

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(requestLogger)

app.use(session({
    secret: process.env.DATABASE_URL || 'mistyrose',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3 // 3 days
    }
  }));

app.use(setUser)
app.use(expressLayouts);

app.use('/sessions', sessionsRouter);
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
