const mongoose = require('mongoose');
const products = require('./products');

mongoose.connect('mongodb+srv://s3979654:mypassword@cluster0.gmpia2z.mongodb.net/products?retryWrites=true&w=majority')
.then(()=>{
    console.log('Connected');
})
.catch((error)=>{
    console.log(error);
});

const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    description: String,
    category: {
        type: String,
        enum: ['dog page', 'cat page'],
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
