// const e = require("express");

// ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } 
    res.redirect("/login");
};

// ensure user is an agent
exports.ensureAgent = (req, res, next) => {
    if (req.session.user && req.session.user.role === "agent") {
        return next();
    }
    res.status(403).send("Access denied. Agents only.");
}

// ensure user is a manager
exports.ensureManager = (req, res, next) => {
    if (req.session.user && req.session.user.role === "manager") {
        return next();
    }
    res.status(403).send("Access denied. Managers only.");
}