import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Profile } from 'passport-google-oauth20';

const router = express.Router();

// Session middleware (required for passport)
router.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user.id);
});
passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback',
}, async (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any) => void
) => {
    try {
        if (!profile.emails || profile.emails.length === 0) {
            return done(new Error('No email found in Google profile'), undefined);
        }
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: 'google-oauth', // placeholder, not used
                createdAt: new Date(),
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, undefined);
    }
}));

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req: any, res) => {
    // Issue JWT and redirect to frontend with token
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    // Redirect to frontend with token as query param
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth?token=${token}`);
});

export default router; 