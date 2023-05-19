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
