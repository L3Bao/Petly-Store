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
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
  },
  businessAddress: {
    type: String,
  },
  name: {
    type: String,
  },
  customerAddress: {
    type: String,
  },
  distributionHub: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

// Add a unique index on username
UserSchema.index({ username: 1 }, { unique: true });

// Add unique indexes on businessName and businessAddress for vendor role only
UserSchema.index({ businessName: 1, role: 1 }, { unique: true, partialFilterExpression: { role: 'vendor' } });
UserSchema.index({ businessAddress: 1, role: 1 }, { unique: true, partialFilterExpression: { role: 'vendor' } });

const User = mongoose.model('User', UserSchema);

module.exports = User;

