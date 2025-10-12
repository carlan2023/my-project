const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StockModel", stockSchema);
