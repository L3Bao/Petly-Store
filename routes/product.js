const express = require('express');
const router = express.Router();
const multer = require('multer');
// ... other required modules

// multer configuration
// ... same multer configuration

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


module.exports = router;