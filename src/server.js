import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import passport from 'passport'

import router from './routes/index.js'
import initializePassport from './configs/passport.js'

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: 'http://localhost:3000',
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
}))
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600 * 1000 * 24 }
}))

// PASSPORT OAUTH
initializePassport(passport)
app.use(passport.session());

// CONNECT DB
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('DB connected')
});

// ROUTER
router(app)
app.use((err, req, res, next) => {
    const errStatus = err.status || 500
    const errMessage = err.message
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    })
})


app.listen(port, () => { console.log('listening on port ' + port) })