const express = require('express');
const app = express();
const port = 3000;

const connectDB = require('./db');
const Product = require('./productSchema');
const Order = require('./orderSchema');
const User = require('./userSchema');
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose')

app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});



// config multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.redirect('/login');
});


// Connect to MongoDB using Mongoose
connectDB();


// Registration (Sign Up) Route
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
  
  
  
  


app.get('/', (req, res) => {
    res.redirect('/login');
});

// Login Route
app.get('/login', (req, res) => {
    res.render('login', { user: req.user }); // Pass the user variable to the login template
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


// Middleware to check if user is authenticated and has the required role
const authenticate = (req, res, next) => {
    // Check if user is authenticated (session, token, etc.)
    // Retrieve the user's role from the session or token

    // Example implementation assuming you store user information in req.user
    if (req.user && req.user.role) {
        // Check if the user has the required role for access
        if (req.user.role === 'vendor') {
            next(); // User is authenticated and has the required role, proceed to the next middleware or route handler
        } else if (req.user.role === 'customer') {
            res.redirect('/customer-dashboard'); // Redirect customers to their dashboard
        } else {
            res.status(403).send('Access denied'); // User has an unrecognized role, deny access
        }
    } else {
        res.redirect('/login'); // User is not authenticated, redirect to the login page
    }
};

// Route to manage order page
app.get('/manage-orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find().populate('products');

        res.render('manage-orders', { orders, user: req.user });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).send('An error occurred while retrieving orders');
    }
});



app.get('/vendor-dashboard', async (req, res) => {
    try {
        const products = await Product.find(); // Retrieve products from the MongoDB collection
        const user = req.user; // Retrieve the user from the request object or session

        res.render('vendor-dashboard', { products, user }); // Pass the products data to the vendor dashboard view
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('An error occurred while retrieving products');
    }
});

app.get('/customer-dashboard', async (req, res) => {
    try {
        const products = await Product.find(); // Retrieve products from the MongoDB collection
        const user = req.user; // Retrieve the user from the request object or session

        res.render('customer-dashboard', { products, user }); // Pass the products and user data to the customer-dashboard view
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('An error occurred while retrieving products');
    }
});

// Route protected by authentication middleware and restricted to vendors
app.get('/add-product', authenticate, (req, res) => {
    res.render('add-product', { user: req.user }); // Pass the user variable to the add-product template
});

app.post('/add-product', authenticate, upload.single('image'), async (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.path : '';
    try {
        const product = new Product({
            name,
            price,
            description,
            image
        });

        await product.save();
        res.redirect('/vendor-dashboard');
    } catch (error) {
        console.error('Error adding new product:', error);
        res.status(500).send('An error occurred while adding the product');
    }
});

app.get('/edit-product/:id', authenticate, async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('edit-product', { product, user: req.user });
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('An error occurred while retrieving the product');
    }
});





app.post('/update-product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the fields that have been changed
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }

        // Check if the user uploaded a new image
        if (req.files && req.files.image) {
            // Handle image upload here
            // ...

            // Update the image field
            product.image = updatedImageUrl;
        }

        await product.save();

        res.redirect(`/product/${product._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});




app.post('/delete-product/:id', authenticate, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/vendor-dashboard');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('An error occurred while deleting the product');
    }
});

app.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send('Invalid product ID');
        }

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('product', { product, user: req.user });
    } catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).send('An error occurred while retrieving the product');
    }
});



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

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});



//order page
app.get('/order-page', async (req, res) => {
    try {
        const products = await Product.find(); // Retrieve products from the MongoDB collection

        res.render('order', { products, user: req.user });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('An error occurred while retrieving products');
    }
});
app.post('/update-order/:id', authenticate, async (req, res) => {
    try {
        const orderId = req.params.id;
        // Retrieve updated order details from the request body
        const { customerName, products } = req.body;

        // Update the order in the database
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { customerName, products },
            { new: true }
        );

        res.redirect('/manage-orders');
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('An error occurred while updating the order');
    }
});

app.get('/edit-order/:id', authenticate, async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('products');
        const products = await Product.find();

        res.render('edit-order', { order, products, user: req.user });
    } catch (error) {
        console.error('Error retrieving order:', error);
        res.status(500).send('An error occurred while retrieving the order');
    }
});

app.post('/update-order/:id', authenticate, async (req, res) => {
    try {
        const orderId = req.params.id;
        const { customerName, products } = req.body;

        // Find the order in the database
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Update the order data
        order.customerName = customerName;
        order.products = products;

        // Save the updated order
        await order.save();

        res.redirect('/manage-orders');
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).send('An error occurred while updating the order');
    }
});







app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

