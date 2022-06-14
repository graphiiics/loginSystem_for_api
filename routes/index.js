require('dotenv').config();
const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

// GET home page
router.get('/', (req, res, next) => {
    res.send('HELLO BITCH');
});

// TODO: research how works middleware: passport authenticate
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Sign up successfully',
        user: req.user,
    });
});

router.post('/login', async(req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
        try {
            if( err || !user ){
                console.log(err);
                const error = new Error('new Error');
                return next(error);
            }
            // TODO: what do req.login?
            req.login(user, { session: false }, async(err) => {
                if(err) return next(err);
                const body = {_id: user._id, email: user.email }
                const token = jwt.sign({ user: body }, process.env.SESSION_SECRET,);
                return res.json({token});
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next) // TODO: What means this?
});


router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({
        message: 'You do it bitch!',
        user: req.user,
        token: req.query.secret_token,
    });
});


module.exports = router;