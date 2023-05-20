// Semester: 2023A
// Assessment: Assignment 2
// Author: 
//     To Bao Minh Hoang: s3978554
//     Le Viet Bao: s3979654
//     Huynh Ngoc Giang My: s3978986
//     Luu van Thien Toan: s3979512
//     Pho An Ninh: s3978162
// Acknowledgement: https://youtube.com/watch?v=991fdnSllcw&feature=share - live search bar, chatgpt, Mr Tom Huynh's RMIT Store 

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    description: String,
    category: {
        type: String,
        enum: ['dog page', 'cat page'],
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
