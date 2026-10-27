function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

module.exports = {
  port: Number(process.env.PORT || 8080),
  databaseUrl: required("DATABASE_URL", "postgres://irms_admin:irms_password_123@localhost:5432/irms_db"),
  jwtSecret: required("JWT_SECRET", "irms_dev_secret"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  uploadDir: process.env.UPLOAD_DIR || "/app/uploads",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  demoAsOf: process.env.DEMO_AS_OF || null,
  dashboardPeriodFrom: process.env.DASHBOARD_PERIOD_FROM || "2026-09-30T17:00:00.000Z",
  dashboardPeriodTo: process.env.DASHBOARD_PERIOD_TO || "2026-10-20T17:00:00.000Z",
  priorityHours: {
    LOW: 48,
    MEDIUM: 24,
    HIGH: 8,
  },
};
