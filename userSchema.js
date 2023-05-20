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
