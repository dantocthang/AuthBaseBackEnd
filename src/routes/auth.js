import express from 'express';
import passport from 'passport';

import AuthController from '../controllers/AuthController.js';

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/token', AuthController.refresh)
router.delete('/logout', AuthController.logout)
// router.get('/userInfo', AuthController.userInfo)
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }
    else res.json({msg: 'NO USER'})
});

// Login Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: "auth/login/failed",
}))


// Login with Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: CLIENT_URL,
    failureRedirect: "auth/login/failed",
}))

// Check login status
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            //   cookies: req.cookies
        });
    }
    else res.json({msg: 'NO USER'})
});

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
});

export default router