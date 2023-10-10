require('dotenv').config()

const express = require('express');
const app = express();
const port = process.env.PORT || 8800;
const flash = require('connect-flash');

const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')
const todosRouter = require('./routes/todos')
const sessionsRouter = require('./routes/sessions')

const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const cookieParser = require("cookie-parser");
const session = require('express-session')

const setUser = require('./middlewares/set_user')
const ensuredLoggedIn = require('./middlewares/ensured_logged_in')
const requestLogger = require('./middlewares/request_logger')
const requestToDeleteMethod = require('./middlewares/request_to_delete')

// app.set('views', path.join(__dirname, 'views'));

app.use(flash());

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}))

app.use(express.json())

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(cookieParser());

app.use(requestLogger)
app.use(requestToDeleteMethod)

app.use(session({
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 3 },
  secret: process.env.SESSION_SECRET || 'mistyrose',
  resave: false,
  saveUninitialized: true,
})
);

app.use(expressLayouts);
app.use(setUser)

app.use('/', sessionsRouter);
app.use('/', indexRouter);
app.use('/', postsRouter);
app.use('/', todosRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});