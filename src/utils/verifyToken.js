import jwt from 'jsonwebtoken'
import { createError } from './error.js'
import User from '../models/User.js'

function extractToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1]
    return null
}

export const verifyToken = (req, res, next) => {
    const token = extractToken(req) || req.cookies.access_token
    if (req.user) {
        console.log("Logged in with Oauth")
        return next()
    }
    if (!token) {
        console.log('Invalid token')
        return next(createError(401, "You are not authenticated!"))
    }


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return next(createError(403, 'Token is invalid!'))
        req.user = user
        next()
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, async () => {
        const user = await User.findById(req.params.id)
        if (req.user) {
            if ((user && (user?.googleId == req.user.id || user?.facebookId == req.user.id)) || req.user?.id === req.params.id || req.user?.isAdmin)
                next()
        } else {
            return next(createError(403, 'You do not have permission to access this'))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user?.isAdmin) {
            next()
        } else {
            return next(createError(403, 'You are not an Admin'))
        }
    })

}
