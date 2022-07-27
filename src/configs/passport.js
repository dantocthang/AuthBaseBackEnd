// import LocalStrategy from 'passport-local'
import bcrypt from 'bcryptjs'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as FacebookStrategy } from 'passport-facebook'

import User from '../models/User.js'
import { googleKeys, facebookKeys } from './keys.js'

function initializePassport(passport) {
    passport.use(new GoogleStrategy({
        clientID: googleKeys.clientID,
        clientSecret: googleKeys.clientSecret,
        callbackURL: googleKeys.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        if (profile.id) {
            User.findOne({ googleId: profile.id })
                .then(async (existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            username: profile.name.familyName + ' ' + profile.name.givenName,
                            image: profile.photos[0].value
                        })
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    }
    ))


    // Xác thực user đăng nhập bằng Facebook
    passport.use(new FacebookStrategy({
        clientID: facebookKeys.facebook_key,
        clientSecret: facebookKeys.facebook_secret,
        callbackURL: facebookKeys.callback_url,
        profileFields: ['id', 'displayName', 'photos']
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (profile.id) {
                    User.findOne({ facebookId: profile.id })
                        .then(async (existingUser) => {
                            if (existingUser) {
                                done(null, existingUser);
                            } else {
                                const hashedPassword = await bcrypt.hash(profile.id, 10)
                                new User({
                                    facebookId: profile.id,
                                    username: profile.displayName,
                                    image: profile.photos[0].value
                                })
                                    .save()
                                    .then(user => done(null, user));
                            }
                        })
                }
            });
        }
    ));


    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

}

export default initializePassport