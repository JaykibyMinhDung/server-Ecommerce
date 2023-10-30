const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  order: {
    type: Array,
    // require: true,
  },
  role: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
