const mongoose = require('mongoose');
const Product = require('./productSchema');
const products = require('./products');

async function connectDB() {
    try {
      await mongoose.connect('mongodb+srv://s3979654:mypassword@cluster0.gmpia2z.mongodb.net/products?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
  
      console.log('Connected to MongoDB');
  
      const existingProducts = await Product.find();
      const existingProductIds = existingProducts.map(product => product.id);
  
      const newProducts = products.filter(product => !existingProductIds.includes(product.id));
  
      if (newProducts.length > 0) {
        console.log('Updating product data in MongoDB...');
  
        // Insert the new products
        await Product.insertMany(newProducts);
  
        console.log('Product data updated in MongoDB');
      }
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  
  module.exports = connectDB;
  
