import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] ?? req.cookies.access_token
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Token expired' })
        req.user = user
        next()
    })
}

export const verifyUser = (req, res, next) => {
    authenticateToken(req, res, async () => {
        const user = await User.findById(req.params.userId)
        if (req.user) {
            if ((user && (user?.googleId === req.user.id || user?.facebookId === req.user.id)) || req.user?.id === req.params.id)
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


export default authenticateToken