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

const orderSchema = new mongoose.Schema({
  customerName: String,
  customerAddress: String,
  customerPhone: String,
  distributionHub: {
    type: String,
    enum: ['hanoi', 'hcm', 'danang'],
    default: 'hanoi'
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number
    }
  ],
  total: Number,
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
