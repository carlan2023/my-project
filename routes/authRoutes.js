const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserModel = require("../models/userModel");
const StockModel = require("../models/stockModel");
const SalesModel = require("../models/salesModel");
const userModel = require("../models/userModel");
const { ensureAuthenticated, ensureManager } = require("../middleware/auth");

// signup form
router.get("/", (req, res) => {
  res.render("index", { title: "Landing Page" });
});

router.get("/register-user", ensureManager, async (req, res) => {
  res.render("register-user", { title: "register new user" });
});

router.post("/register-user", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    console.log(req.body);

    let existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .send(
          "This email has an existing account, please login or use another email"
        );
    }

    UserModel.register(user, req.body.password, (error) => {
      if (error) {
        console.error(error);
        return res.status(400).send("Registration failed");
      }
      res.redirect("/login");
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Try again");
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    let currentUser = req.session.user.role;
    let currentUserName = req.session.user.name;
    let totalItems = await StockModel.countDocuments();
    let totalSales = await SalesModel.countDocuments({ status: "sold" });
    let inStock = await StockModel.countDocuments({ status: "in-stock" });
    let totalUsers = await userModel.countDocuments({ role: "agent" });
    let salesData = await SalesModel.aggregate([
      {
        $group: {
          _id: { $month: "$dateSold" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    let topProducts = await SalesModel.aggregate([{ $unwind: "$itemsSold" }]);
    let outOfStock = await StockModel.countDocuments({
      status: "out-of-stock",
    });
    let lowStock = await StockModel.countDocuments({ status: "low-stock" });
    let recentSales = await SalesModel.find().sort({ $natural: -1 }).limit(3);
    let totalCost = await StockModel.aggregate([
      { $match: { category: "Chairs" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    let totalCostShelves = await StockModel.aggregate([
      { $match: { category: "Shelves" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    let totalCostChairs = await StockModel.aggregate([
      { $match: { category: "Chairs" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    let totalCostCabinets = await StockModel.aggregate([
      { $match: { category: "Cabinets" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    let totalCostRawMaterials = await StockModel.aggregate([
      { $match: { category: "Raw Materials" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    let totalCostTables = await StockModel.aggregate([
      { $match: { category: "Tables" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalCost: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    //To avoid crushing of the dashboard when there is no data in the database
    // I added a condition to check if the array is empty and if it is, I set the to
    totalCostShelves = totalCostShelves[0] ?? {
      totalCost: 0,
      totalQuantity: 0,
    };
    totalCostChairs = totalCostChairs[0] ?? { totalCost: 0, totalQuantity: 0 };
    totalCostCabinets = totalCostCabinets[0] ?? {
      totalCost: 0,
      totalQuantity: 0,
    };
    totalCostRawMaterials = totalCostRawMaterials[0] ?? {
      totalCost: 0,
      totalQuantity: 0,
    };
    totalCostTables = totalCostTables[0] ?? { totalCost: 0, totalQuantity: 0 };
    totalCostCabinets = totalCostCabinets[0] ?? {
      totalCost: 0,
      totalQuantity: 0,
    };
    res.render("dashboard", {
      title: "Seller Dashboard",
      totalCostRawMaterials,
      totalCostChairs,
      totalCostShelves,
      totalCostTables,
      totalCostCabinets,
      totalItems,
      totalSales,
      recentSales,
      salesData,
      currentUser,
      currentUserName,
      totalUsers,
    });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(400).send("Unable to get data from the database");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "login user" });
});

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/noneuser" }),
  (req, res) => {
    req.session.user = req.user;
    console.log(req.body);

    if (req.user.role === "manager") {
      return res.redirect("/dashboard");
    } else if (req.user.role === "agent") {
      return res.redirect("/dashboard");
    } else {
      return res.render("noneuser");
    }
  }
);
router.get("/noneuser", (req, res) => {
  res.render("noneuser", { title: "Unknown" });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error Logging out");
      }
      res.redirect("/");
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    let currentUser = req.session.user.role;
    let users = await UserModel.find().sort({ $natural: -1 });
    console.log(users);
    res.render("users", { users, currentUser });
  } catch (error) {
    res.status(400).send("Unable to get user");
  }
});

module.exports = router;
