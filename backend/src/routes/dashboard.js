const express = require("express");
const { getDashboard } = require("../services/dashboardService");

const router = express.Router();

router.get("/dashboard", async (req, res, next) => {
  try {
    res.json(await getDashboard(req.user, req.query));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
