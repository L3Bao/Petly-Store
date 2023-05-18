const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'vendor', 'shipper']
  },
  businessName: {
    type: String
  },
  businessAddress: {
    type: String
  },
  customerAddress: {
    type: String
  },
  distributionHub: {
    type: String,
    enum: ['hanoi', 'hcm', 'danang'],
    required: function () {
      return this.role === 'shipper';
    }
  },
  profilePicture: {
    type: String
  },
  name: {
    type: String
  }
});

// Create and export the user model
module.exports = mongoose.model('User', userSchema);
