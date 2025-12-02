const express = require("express");
const router = express.Router();
const multer = require('multer')
const salesModel = require("../models/salesModel");



router.get("/addSale", (req, res) => {
  res.render("sale", { title: "Inventory" });
});
router.post("/addSale", async (req, res) => {
  try {
    const stock = new salesModel(req.body);
    console.log(req.body);
    await stock.save();
    res.redirect("/stock/saleslist");
  } catch (error) {
    console.error(error);
    res.redirect("/stock/register-stock");
  }
});


router.get("/saleslist", async (req, res) => {
  try {
    let items = await salesModel.find().sort({ $natural: -1 });
    res.render("sales-list", { items: items || [], title: "Inventory" });
  } catch (error) {
    console.error(error);
    res.status(400).send("Unable to get data from the database");
  }
});

router.put("/sales-list", (req, res) => {});


module.exports = router;
