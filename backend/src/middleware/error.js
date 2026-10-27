const { AppError } = require("../utils/errors");

function errorHandler(err, req, res, _next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: { code: "PAYLOAD_TOO_LARGE", message: "Tệp vượt quá 5 MiB" },
    });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }
  console.error(err);
  return res.status(500).json({
    error: { code: "INTERNAL", message: "Lỗi hệ thống" },
  });
}

module.exports = { errorHandler };
