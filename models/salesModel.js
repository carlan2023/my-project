const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  agent: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  transport: {
    type: Boolean,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  //   image: {
  //     required: true,
  //   },
});

module.exports = mongoose.model("SalesModel", salesSchema);
