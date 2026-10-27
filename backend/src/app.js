const fs = require("fs");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const { pool } = require("./db/pool");
const { authRequired } = require("./middleware/auth");
const { errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const attachmentRoutes = require("./routes/attachments");
const dashboardRoutes = require("./routes/dashboard");

fs.mkdirSync(config.uploadDir, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: false,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "up" });
  } catch {
    res.status(503).json({ status: "degraded", database: "down" });
  }
});

app.use("/auth", authRoutes);
app.use(authRequired);
app.use(requestRoutes);
app.use(attachmentRoutes);
app.use(dashboardRoutes);
app.use(errorHandler);

module.exports = { app };
