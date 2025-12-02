// instantiations
const express = require("express");
const router = express.Router();
// const path = require("path");
const multer = require("multer");
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

const stockModel = require("../models/stockModel");
const { upload } = require("../server");
const _ = require("passport-local-mongoose");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../public/uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });
// getting the signup form
router.get("/register-stock", (req, res) => {
  res.render("register-stock", { title: "register new stock" });
});

router.post("/register-stock", upload.single("image"), async (req, res) => {
  try {
    const { productName, category, quantity, price } = req.body;
    const imagePath = "/uploads/" + req.file.filename;

    const stock = new stockModel({
      productName,
      category,
      quantity,
      price,
      image: imagePath,
    });

    console.log(req.body);
    await stock.save();
    res.redirect("/stock/products");
  } catch (error) {
    console.error(error);
    res.redirect("/stock/register-stock");
  }
});
router.get("/products", async (req, res) => {
  try {
    let stocks = await stockModel.find().sort({ $natural: -1 });
    let currentUser = req.session.user.role;
    console.log(currentUser);
    // res.json(stocks);
    res.render("products", { stocks, currentUser, title: "Inventory" });
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to get data from the database");
  }
});

router.get("/edit-stock/:id", ensureManager, async (req, res) => {
  let stock = await stockModel.findById(req.params.id);
  const currentUser = req.session.user.role;
  if (!stock) {
    return res.status(404).send("Stock not found");
  }
  res.render("edit-stock", { stock, currentUser, title: "Edit Stock" });
});

router.put(
  "/edit-stock/:id",
  upload.single("image"),
  ensureManager,
  async (req, res) => {
    try {
      const stockId = await stockModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!stockId) {
        return res.status(404).send("Stock not found");
      }
      // console.log(stockId);
    } catch (error) {}
  }
);

router.post("/delete-stock/:id", async (req, res) => {
  try {
    await stockModel.deleteOne({ _id: req.body.id });

    res.redirect("/stock/products");
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to delete stock");
  }
});
module.exports = router;
