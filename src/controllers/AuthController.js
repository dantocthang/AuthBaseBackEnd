import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'
import RefreshToken from '../models/RefreshToken.js'
import generateAccessToken from '../utils/generateAccessToken.js'

class AuthController {
    // [POST] /auth/login
    async login(req, res, next) {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (user) {
                const isCorrectPassword = await bcrypt.compare(req.body.password, user.password)
                if (isCorrectPassword) {
                    const accessToken = generateAccessToken(user.toJSON())
                    const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, { expiresIn: '8h' })
                    const rToken = new RefreshToken({ token: refreshToken })
                    await rToken.save()
                    res.cookie("access_token", accessToken).cookie("refresh_token", refreshToken).json({ success: true, accessToken: accessToken, refreshToken: refreshToken, details: user })
                }
                else res.json({ success: false, message: 'Invalid password' })
            }
            else res.json({ success: false, message: 'Username does not exist' })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /register
    async register(req, res, next) {
        try {
            const isDuplicate = !!(await User.findOne({ username: req.body.username }))
            if (isDuplicate) {
                return res.json({
                    success: false,
                    msg: "Tên đăng nhập đã tồn tại",
                })
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const savedUser = new User({
                username: req.body.username,
                password: hashedPassword,
                // email: req.body.email
            })
            await savedUser.save()
            res.json({ success: true, user: savedUser })
        } catch (error) {
            next(error)
        }
    }

    // [POST] /auth/refresh
    async refresh(req, res, next) {
        if (req.body.token == null) return res.sendStatus(401)
        const refreshToken = await RefreshToken.findOne({ token: req.body.token }) ?? null
        if (!refreshToken) return res.sendStatus(403)
        jwt.verify(refreshToken.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            const accessToken = generateAccessToken({ name: user.name })
            res.cookie('access_token', accessToken).json({ success: true, accessToken: accessToken })
        })
    }

    // [DELETE] /auth/logout
    async logout(req, res, next) {
        try {
            await RefreshToken.findOneAndDelete({ token: req.body.token })
            if (req?.user) req.logout(() => console.log('Log out!'));
            res.clearCookie('access_token')
            res.json({ success: true, message: 'Logged out' })
        } catch (error) {
            res.json({ success: false, message: 'An error has occurred' })
        }
    }

    // [GET] /auth/user
    userInfo(req, res, next) {
        if (req.user) return res.json(req.user)
        return res.json({ success: false, message: 'No user' })
    }
}

export default new AuthController