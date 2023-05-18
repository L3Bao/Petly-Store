const express = require('express');
const router = express.Router();
const passport = require('passport');
// ... other required modules

// Passport configuration
// ... same passport configuration

app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login Route
app.get('/login', (req, res) => {
    res.render('login', { user: req.user }); // Pass the user variable to the login template
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed, redirect to login page with error message and previous input
            return res.render('login', {
                user: req.user,
                message: 'Invalid username or password.',
                username: req.body.username, // Keep the username input
                password: req.body.password // Keep the password input
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Authentication successful, redirect to dashboard or appropriate page
            if (req.user.role === 'vendor') {
                return res.redirect('/vendor-dashboard');
            } else if (req.user.role === 'customer') {
                return res.redirect('/customer-dashboard');
            } else {
                return res.status(403).send('Access denied');
            }
        });
    })(req, res, next);
});

app.get('/signup', (req, res) => {
    res.render('signup', { user: req.user }); // Pass the user variable to the signup template
});

app.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            const errorMessage = 'Username already exists';
            return res.status(409).render('signup', { errorMessage, user: req.user });
        }

        const user = new User({
            username,
            password,
            role
        });

        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('An error occurred while creating the user');
    }
});



// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

app.get('/dashboard', (req, res) => {
    if (req.user && req.user.role) {
        if (req.user.role === 'vendor') {
            res.redirect('/vendor-dashboard');
        } else if (req.user.role === 'customer') {
            res.redirect('/customer-dashboard');
        } else {
            res.status(403).send('Access denied');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;