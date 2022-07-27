import authRouter from './auth.js'
import postRouter from './post.js'

function router(app) {
    app.use('/auth', authRouter)
    app.use('/post', postRouter)
}

export default router