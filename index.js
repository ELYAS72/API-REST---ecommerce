const express = require('express')
const { engine } = require('express-handlebars')
const path = require('path')
const Sequelize = require('sequelize')
const session = require('express-session')
const helmet = require('helmet')
const crypto = require('crypto')


// parametrage express
const app = express();
const router = require('./API/router')

app.use(helmet({
  contentSecurityPolicy:{
    useDefaults: true,
    directives: {
      "script-src" :["'self'", "cdn.jsdelivr.net"]
    }
  }}
))

//parametrage fichier statique
app.use('/public', express.static(path.join(__dirname, 'assets')))

// parametrage sequelize
const db = require('./config')
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

//parametrage express session:
const SequelizeStore = require("connect-session-sequelize")(session.Store)
app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore({
    db:db
  }),
  resave: false,
  saveUninitialized: true,
  proxy:true
}))

//parametrage du local storage
app.use('*', (req, res, next) => {
  if (req.session) {
    res.locals.userPk = req.session.userPk
    res.locals.firstName = req.session.firstName
}
  next()
})

// parametrage handlebars
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
      ifCond: function (v1, v2, option) {
        if (v1 === v2) {
          return option.fn(this)
        }
        return option.inverse(this)
      }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// parametrage bodyparser
app.use(express.urlencoded({extended: true}))

// fonction de creation d'un token
function generateCsrfToken(){
  return crypto.randomBytes(16).toString('hex')
}

app.use((req, res, next) => {
  res.locals.csrf = req.session.csrfToken || (req.session.csrfToken = generateCsrfToken())
  next()
})

// fonctionnement serveur
app.use('/', router)

app.listen(3000, function () {
    console.log(`Le serveur ecoute sur http://localhost:3000`)
});