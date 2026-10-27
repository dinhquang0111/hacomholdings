const express = require("express");
const { login, logout } = require("../services/authService");
const { authRequired, publicUser } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: "TOO_MANY", message: "Quá nhiều lần thử đăng nhập" } },
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const result = await login(req.body?.email, req.body?.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authRequired, async (req, res, next) => {
  try {
    await logout(req.sessionId);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authRequired, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
