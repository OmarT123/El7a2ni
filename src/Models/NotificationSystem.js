const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  type:{ type: String, //String reference patient/admin/doc/phar
  required: true,
  },
  Id: {
    type: String, //String reference patientId/adminId/docId/pharId
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  showtime: {
    type: Date,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false, // By default, notifications are not seen
  },
  // Other fields as needed
}, { timestamps: true });

const Notification = mongoose.model('NotificationSystem', Schema);
module.exports = Notification;