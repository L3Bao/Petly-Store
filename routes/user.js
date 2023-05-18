const express = require('express');
const router = express.Router();


// code to route to profile page
app.get('/profile', (req, res) => {
    if (req.user) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/login');
    }
});
app.post('/profile', async (req, res) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }

    try {
        const { username, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true });
        req.user = updatedUser; // Update the user object in the request

        // Redirect the user to their respective dashboard
        if (req.user.role === 'vendor') {
            res.redirect('/vendor-dashboard');
        } else if (req.user.role === 'customer') {
            res.redirect('/customer-dashboard');
        } else {
            res.status(403).send('Access denied');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('An error occurred while updating the profile');
    }
});

module.exports = router;