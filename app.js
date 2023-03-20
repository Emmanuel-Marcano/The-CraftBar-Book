if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

//console.log(process.env.CLOUDINARY_CLOUD_NAME,
 //   process.env.CLOUDINARY_KEY,
 //   process.env.CLOUDINARY_SECRET)

//
// 

const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const barRoutes = require('./routes/bars')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const MongoStore = require('connect-mongo')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/craftBar-book'

// 'mongodb://localhost:27017/craftBar-book'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true   
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const secret = process.env.SECRET || 'thisshouldbeabettersecret'


const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e){
    console.log('ERRROR')
})

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})

app.use('/', barRoutes)
app.use('/', reviewRoutes)
app.use('/', userRoutes)


app.get('/', (req,res) => {
    res.render('home')
})

// Positioning of your routes is important. this will only run if nothing else was matched first.
app.all('*', (req, res, next)=>{ 
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong!"
    res.status(statusCode).render('error', { err })
    
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})