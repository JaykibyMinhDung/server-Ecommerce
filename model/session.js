const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  admin: {
    type: String,
    // require: true,
  },
  // adminMessage: {
  //   type: Array,
  //   require: true,
  // },
  // clientMessage: {
  //   type: Array,
  //   require: true,
  // },
  message: {
    type: Array,
    require: true,
  },
  phone: {
    type: Number,
    // require: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  role: {
    type: Number,
    ref: "User",
    require: true,
  },
});

module.exports = mongoose.model("Session", chatSchema);
