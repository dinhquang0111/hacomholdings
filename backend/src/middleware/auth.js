const jwt = require("jsonwebtoken");
const config = require("../config");
const { pool } = require("../db/pool");
const { unauthorized } = require("../utils/errors");

async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw unauthorized();
    }
    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch {
      throw unauthorized("Token không hợp lệ hoặc đã hết hạn");
    }
    const sessionResult = await pool.query(
      `SELECT s.id, s.user_id, s.expires_at, s.revoked_at,
              u.id AS uid, u.email, u.display_name, u.role, u.is_active,
              u.home_department_id, u.service_department_id
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = $1`,
      [payload.sid]
    );
    const row = sessionResult.rows[0];
    if (!row || row.revoked_at || new Date(row.expires_at) <= new Date()) {
      throw unauthorized("Phiên đã hết hạn hoặc bị thu hồi");
    }
    if (!row.is_active) {
      throw unauthorized("Tài khoản đã bị vô hiệu hóa");
    }
    req.user = {
      id: row.uid,
      email: row.email,
      displayName: row.display_name,
      role: row.role,
      isActive: row.is_active,
      homeDepartmentId: row.home_department_id,
      serviceDepartmentId: row.service_department_id,
    };
    req.sessionId = row.id;
    next();
  } catch (error) {
    next(error);
  }
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    homeDepartmentId: user.homeDepartmentId,
    serviceDepartmentId: user.serviceDepartmentId,
  };
}

module.exports = { authRequired, publicUser };
