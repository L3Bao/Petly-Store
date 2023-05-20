const express = require("express");
const app = express();
const port = 3000;

const connectDB = require("./db");
const Product = require("./productSchema");
const Order = require("./orderSchema");
const User = require("./userSchema");
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
app.use(express.static('public'));



app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  next();
});

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // Compare hashed password with the entered password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

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
  },
});

const upload = multer({ storage: storage });


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Connect to MongoDB using Mongoose
connectDB();

// Registration (Sign Up) Route
app.get("/signup", (req, res) => {
  res.render("signup", { user: req.user }); // Pass the user variable to the signup template
});
app.post("/signup", upload.single("profilePicture"), async (req, res) => {
  const {
    username,
    password,
    role,
    businessName,
    businessAddress,
    customerAddress,
    distributionHub,
    name,
  } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      const errorMessage = "Username already exists";
      return res.status(409).render("signup", { errorMessage, user: req.user });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Format the image path
    const imagePath = req.file ? req.file.path.replace('public\\', '').replace(/\\/g, '/') : null;

    const user = new User({
      username,
      password: hashedPassword, // Store the hashed password in the database
      role,
      businessName, // Save business name if provided
      businessAddress, // Save business address if provided
      customerAddress, // Save customer address if provided
      distributionHub, // Save distribution hub if provided
      name,
      profilePicture: imagePath, // Save profile picture if provided
    });

    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred while creating the user");
  }
});


// Login Route
app.get("/login", (req, res) => {
  res.render("login", { user: req.user }); // Pass the user variable to the login template
});

app.get("/dashboard", (req, res) => {
  if (req.user && req.user.role) {
    if (req.user.role === "vendor") {
      res.redirect("/vendor-dashboard");
    } else if (req.user.role === "customer") {
      res.redirect("/customer-dashboard");
    } else if (req.user.role === "shipper") {
      res.redirect("/shipper");
    } else {
      res.status(403).send("Access denied");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, redirect to login page with error message and previous input
      return res.render("login", {
        user: req.user,
        message: "Invalid username or password.",
        username: req.body.username, // Keep the username input
        password: req.body.password, // Keep the password input
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful, redirect to dashboard or appropriate page
      if (req.user.role === "vendor") {
        return res.redirect("/vendor-dashboard");
      } else if (req.user.role === "customer") {
        return res.redirect("/customer-dashboard");
      } else if (req.user.role === "shipper") {
        return res.redirect("/shipper");
      } else {
        return res.status(403).send("Access denied");
      }
    });
  })(req, res, next);
});

// Middleware to check if user is authenticated and has the required role
const authenticate = (req, res, next) => {
  if (req.user && req.user.role) {
    if (isDashboardRoute(req.path)) {
      if (req.user.role === "vendor" && !isVendorDashboardRoute(req.path)) {
        res.status(403).send("Access denied"); // Vendor can only access vendor dashboard
      } else if (req.user.role === "customer" && !isCustomerDashboardRoute(req.path)) {
        res.status(403).send("Access denied"); // Customer can only access customer dashboard
      } else if (req.user.role === "shipper" && !isShipperDashboardRoute(req.path)) {
        res.status(403).send("Access denied"); // Shipper can only access shipper dashboard
      } else {
        next(); // User has access to their own dashboard
      }
    } else {
      next(); // User has access to non-dashboard routes
    }
  } else {
    res.status(401).send("Unauthorized"); // User is not authenticated, deny access
  }
};

// Helper functions to check if the route belongs to a specific dashboard
const isVendorDashboardRoute = (route) => {
  // Define the vendor dashboard route
  const vendorDashboardRoute = "/vendor-dashboard";

  return route === vendorDashboardRoute;
};

const isCustomerDashboardRoute = (route) => {
  // Define the customer dashboard route
  const customerDashboardRoute = "/customer-dashboard";

  return route === customerDashboardRoute;
};

const isShipperDashboardRoute = (route) => {
  // Define the shipper dashboard route
  const shipperDashboardRoute = "/shipper";

  return route === shipperDashboardRoute;
};

const isDashboardRoute = (route) => {
  // Define all dashboard routes
  const dashboardRoutes = ["/vendor-dashboard", "/customer-dashboard", "/shipper"];

  return dashboardRoutes.includes(route);
};



// Add the body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/getProduct", async (req, res) => {
  let payload = req.body.payload.trim();
  let search = await Product.find({
    name: { $regex: new RegExp("^" + payload + ".*", "i") },
  }).exec();
  // Limit Search Results to 10
  search = search.slice(0, 10);
  res.send({ payload: search });
});
app.post("/cart", async (req, res) => {
  const productId = req.body.productId;
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      console.log("Product not found");
      return res.redirect("/");
    }

    console.log("Product ObjectId:", product._id);

    req.session.cartProductIds = req.session.cartProductIds || [];

    // Find the existing product in the cart
    const existingProduct = req.session.cartProductIds.find(
      (item) => item.id === productId
    );

    if (existingProduct) {
      // If the product already exists in the cart, increment the quantity
      existingProduct.quantity += quantity;
    } else {
      // Otherwise, add the product to the cart
      req.session.cartProductIds.push({ id: product._id, quantity: quantity });
    }

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Add a new route to display products with the category "cat page"
app.get("/products/cat-page", authenticate ,async (req, res) => {
  try {
    const catPageProducts = await Product.find({ category: "cat page" });
    res.render("cat-page-products", { products: catPageProducts, user: req.user });
  } catch (error) {
    console.error("Error retrieving cat page products:", error);
    res.status(500).send("An error occurred while retrieving cat page products");
  }
});

// Add a new route to display products with the category "dog page"
app.get("/products/dog-page",authenticate ,async (req, res) => {
  try {
    const dogPageProducts = await Product.find({ category: "dog page" });
    res.render("dog-page-products", { products:dogPageProducts, user: req.user });
  } catch (error) {
    console.error("Error retrieving dog page products:", error);
    res.status(500).send("An error occurred while retrieving dog page products");
  }
});


app.get("/cart",authenticate ,async (req, res) => {
  const cartProductIds = req.session.cartProductIds || [];

  try {
    const products = [];
    let total = 0;

    for (let i = 0; i < cartProductIds.length; i++) {
      const product = await Product.findById(cartProductIds[i].id);
      if (product) {
        products.push({
          ...product._doc,
          quantity: cartProductIds[i].quantity,
        });
        total += product.price * cartProductIds[i].quantity;
      }
    }

    const cart = { items: products, total: total }; // Update total here

    res.render("cart", { cart: cart, user: req.user }); // pass cart instead of products
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});


// place an order
app.post("/placeOrder", async (req, res) => {
  // get customer information from form
  const { customerName, customerAddress, customerPhone, distributionHub } =
    req.body;

  const cartProductIds = req.session.cartProductIds || [];
  try {
    let products = [];
    let total = 0;

    for (let i = 0; i < cartProductIds.length; i++) {
      const product = await Product.findById(cartProductIds[i].id);
      if (product) {
        products.push({
          productId: product._id,
          quantity: cartProductIds[i].quantity,
        });
        total += product.price * cartProductIds[i].quantity;
      }
    }

    // create a new order
    const newOrder = new Order({
      customerName,
      customerAddress,
      customerPhone,
      distributionHub,
      products,
      total,
    });

    // save the order to database
    await newOrder.save();

    // clear the cart
    req.session.cartProductIds = [];

    res.redirect("/order-summary/" + newOrder._id);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});
//ORDER SUMMARY PAGE
app.get("/order-summary/:orderId", async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId).populate("products.productId");

    res.render("order-summary", { order: order, user: req.user });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/order", async (req, res) => {
  const cartProductIds = req.session.cartProductIds || [];

  try {
    const products = [];
    let total = 0;

    for (let i = 0; i < cartProductIds.length; i++) {
      const product = await Product.findById(cartProductIds[i].id);
      if (product) {
        products.push({
          ...product._doc,
          quantity: cartProductIds[i].quantity,
        });
        total += product.price * cartProductIds[i].quantity;
      }
    }

    const cart = { items: products, total: total };

    res.render("order", { cart: cart, user: req.user });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// Price filter //
app.get("/products",authenticate ,async (req, res) => {
  try {
    const minPrice = req.query.minPrice || 0; // Use 0 as the default minPrice
    const maxPrice = req.query.maxPrice || Number.MAX_SAFE_INTEGER; // Use the maximum number as the default maxPrice
    const user = req.user; // get the user object from the request

    const products = await Product.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });

    // Include the user when rendering the 'products' view
    res.render("products", { products, user });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("An error occurred while retrieving products");
  }
});

app.get("/", (req, res) => {
  res.redirect("/login");
});


// Route handler for the shipper page
app.get("/shipper", async (req, res) => {
  try {
    const { distributionHub } = req.user;
    let orders = await Order.find({ status: "active", distributionHub }).lean();
    const user = req.user;

    // Fetch product details for each order
    for (let order of orders) {
      for (let product of order.products) {
        const productDetails = await Product.findById(product.productId.toString());
        if (productDetails) {
          product.details = productDetails;
        } else {
          console.error(`No product details found for product ID: ${product.productId.toString()}`);
        }
      }
    }

    res.render("shipper", { orders, user });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).send("An error occurred while retrieving orders");
  }
});




app.post("/shipper/update-status/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Update the order status to "delivered"
    order.status = "completed";
    await order.save();

    res.redirect("/shipper");
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("An error occurred while updating the order status");
  }
});

app.post("/shipper/cancel-order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndUpdate(orderId, { status: "canceled" }, { new: true });

    res.redirect("/shipper");
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).send("An error occurred while canceling the order");
  }
});


app.get("/vendor-dashboard", authenticate, async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = await Product.find({ vendor: vendorId }); // Only retrieve products associated with the current vendor
    res.render("vendor-dashboard", { products, user: req.user });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("An error occurred while retrieving products");
  }
});


app.get("/customer-dashboard", authenticate,async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve products from the MongoDB collection
    const user = req.user; // Retrieve the user from the request object or session

    res.render("customer-dashboard", { products, user }); // Pass the products and user data to the customer-dashboard view
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("An error occurred while retrieving products");
  }
});

// Route protected by authentication middleware and restricted to vendors
app.get("/add-product", authenticate, (req, res) => {
  res.render("add-product", { user: req.user });
});
app.post(
  "/add-product",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { name, price, description, category } = req.body; // Include category
    const image = req.file ? req.file.path : "";
    try {
      const product = new Product({
        name,
        price,
        description,
        image,
        category, // Include category
        vendor: req.user._id, // Include vendor
      });

      await product.save();
      res.redirect("/vendor-dashboard");
    } catch (error) {
      console.error("Error adding new product:", error);
      res.status(500).send("An error occurred while adding the product");
    }
  }
);



app.get("/edit-product/:id", authenticate, async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("Invalid product ID");
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("edit-product", { product, user: req.user });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("An error occurred while retrieving the product");
  }
});

app.post("/update-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
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

    res.redirect(`/dashboard`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
});

app.post("/delete-product/:id", authenticate, async (req, res) => {
  try {
    // Check if the product was added by the current user before deleting
    const product = await Product.findOne({ _id: req.params.id, vendor: req.user._id });
    if (!product) {
      return res.status(404).send("Product not found or you do not have permission to delete this product");
    }
    await product.remove();
    res.redirect("/vendor-dashboard");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("An error occurred while deleting the product");
  }
});

// code to route to profile page
app.get("/profile", authenticate,(req, res) => {
  if (req.user) {
    res.render("profile", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.post("/profile", authenticate, async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  try {
    const { username, password, name, address, businessName, businessAddress, distributionHub } = req.body;
    let updatedFields = {};
  
    // Check for updates based on user role
    if (req.user.role === "customer") {
      if (name !== req.user.name) {
        updatedFields.name = name;
      }
      if (address !== req.user.customerAddress) {
        updatedFields.customerAddress = address;
      }
    } else if (req.user.role === "vendor") {
      if (businessName !== req.user.businessName) {
        updatedFields.businessName = businessName;
      }
      if (businessAddress !== req.user.businessAddress) {
        updatedFields.businessAddress = businessAddress;
      }
    } else if (req.user.role === "shipper") {
      if (distributionHub !== req.user.distributionHub) {
        updatedFields.distributionHub = distributionHub;
      }
    }
  
    // Update username and password fields
    if (username !== req.user.username) {
      updatedFields.username = username;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }
  
    // Update the user document in MongoDB if there are any changes
    if (Object.keys(updatedFields).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updatedFields,
        { new: true }
      );
      req.user = updatedUser; // Update the user object in the request
      console.log("Updated user:", updatedUser);
      console.log(updatedFields)
    } else {
      console.log("No changes to update.");
    }
  
    // Redirect the user to their respective dashboard
    if (req.user.role === "vendor") {
      res.redirect("/vendor-dashboard");
    } else if (req.user.role === "customer") {
      res.redirect("/customer-dashboard");
    } else if (req.user.role === "shipper") {
      res.redirect("/shipper");
    } else {
      res.status(403).send("Access denied");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("An error occurred while updating the profile");
  }
  
});





// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/login");
  });
});

//order page
app.get("/order-page", async (req, res) => {
  try {
    const products = await Product.find(); // Retrieve products from the MongoDB collection

    res.render("order", { products, user: req.user });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).send("An error occurred while retrieving products");
  }
});
app.post("/order-page", authenticate, async (req, res) => {
  try {
    const { customerName, products } = req.body;

    // Create a new order
    const order = new Order({
      customerName,
      products,
    });

    // Save the order to the database
    await order.save();

    // Redirect the user to the order summary page
    res.redirect(`/order-summary/${order._id}`);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("An error occurred while creating the order");
  }
});

//  Route get and render the product detail page for a specific product
app.get("/product-detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("product-detail", { product, user: req.user });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("An error occurred while retrieving the product");
  }
});
app.post("/update-order/:id", authenticate, async (req, res) => {
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

    res.redirect("/manage-orders");
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("An error occurred while updating the order");
  }
});

app.get("/edit-order/:id", authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("products");
    const products = await Product.find();

    res.render("edit-order", { order, products, user: req.user });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).send("An error occurred while retrieving the order");
  }
});

app.post("/update-order/:id", authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerName, products } = req.body;

    // Find the order in the database
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Update the order data
    order.customerName = customerName;
    order.products = products;

    // Save the updated order
    await order.save();

    res.redirect("/manage-orders");
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("An error occurred while updating the order");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
