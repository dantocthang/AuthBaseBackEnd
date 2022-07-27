export const googleKeys = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
}

export const facebookKeys = {
    facebook_key: process.env.FACEBOOK_ID,
    facebook_secret: process.env.FACEBOOK_SECRET,
    callback_url: 'http://localhost:5000/auth/facebook/callback',
}