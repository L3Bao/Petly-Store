// Semester: 2023A
// Assessment: Assignment 2
// Author: 
//     To Bao Minh Hoang: s3978554
//     Le Viet Bao: s3979654
// Acknowledgement: https://youtube.com/watch?v=991fdnSllcw&feature=share - live search bar, chatgpt, Mr Tom Huynh's RMIT Store 

const mongoose = require('mongoose');
const Product = require('./productSchema');
const products = require('./products');

async function connectDB() {
    try {
      await mongoose.connect('mongodb+srv://User002:57mMSqwlj6OCpVVW@cluster0.r10fdfw.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
  
      console.log('Connected to MongoDB');
  
      const existingProducts = await Product.find();
      const existingProductNames = existingProducts.map(product => product.name);

      const newProducts = products.filter(product => !existingProductNames.includes(product.name));
      
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
