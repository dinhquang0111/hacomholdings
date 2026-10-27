class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details || undefined;
  }
}

function badRequest(message, details) {
  return new AppError(400, "BAD_REQUEST", message, details);
}

function unauthorized(message = "Phiên đăng nhập không hợp lệ") {
  return new AppError(401, "UNAUTHORIZED", message);
}

function forbidden(message = "Bạn không có quyền thực hiện thao tác này") {
  return new AppError(403, "FORBIDDEN", message);
}

function notFound(message = "Không tìm thấy tài nguyên") {
  return new AppError(404, "NOT_FOUND", message);
}

function conflict(message, details) {
  return new AppError(409, "CONFLICT", message, details);
}

function payloadTooLarge(message) {
  return new AppError(413, "PAYLOAD_TOO_LARGE", message);
}

function unsupportedMedia(message) {
  return new AppError(415, "UNSUPPORTED_MEDIA_TYPE", message);
}

module.exports = {
  AppError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  payloadTooLarge,
  unsupportedMedia,
};
