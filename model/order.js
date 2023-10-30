const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, // Loại id, có thể dụng loại object và loại array
    ref: "User", // ref để lấy trùng id với model người dùng
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  cart: {
    type: Array,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  methodPay: {
    type: String,
    require: true,
  },
  progressingDelivery: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
