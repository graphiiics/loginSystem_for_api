require('dotenv').config();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../model/User');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    //console.log(email, password);
    try {
        const user = await User.create({email, password});
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User.findOne({email});
        console.log({user});
        if( !user ){
            return done(null, false, { message: 'User not found' });
        }

        const validate = await user.isValidPassword(password);

        if(!validate){
            return done(null, false, { message: 'wrong password'});
        }

        return done(null, user, { message: 'login sucessfull'});
    } catch (error) {
        return done(error);
    }
}));

passport.use(new JWTStrategy({
    secretOrKey: process.env.SESSION_SECRET,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    console.log(token);
    try {
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}))