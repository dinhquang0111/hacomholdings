const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/pool");
const config = require("../config");
const { unauthorized, badRequest } = require("../utils/errors");
const { publicUser } = require("../middleware/auth");

const loginAttempts = new Map();

function tooManyAttempts(email) {
  const rec = loginAttempts.get(email) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  if (Date.now() > rec.resetAt) {
    loginAttempts.set(email, { count: 0, resetAt: Date.now() + 15 * 60 * 1000 });
    return false;
  }
  return rec.count >= 10;
}

function recordFail(email) {
  const rec = loginAttempts.get(email) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  rec.count += 1;
  loginAttempts.set(email, rec);
}

function clearAttempts(email) {
  loginAttempts.delete(email);
}

async function login(email, password) {
  if (!email || !password) {
    throw badRequest("Email và mật khẩu là bắt buộc");
  }
  const normalized = String(email).trim().toLowerCase();
  if (tooManyAttempts(normalized)) {
    throw unauthorized("Quá nhiều lần đăng nhập thất bại, thử lại sau");
  }
  const result = await pool.query(`SELECT * FROM users WHERE lower(email) = $1`, [normalized]);
  const user = result.rows[0];
  if (!user) {
    recordFail(normalized);
    throw unauthorized("Email hoặc mật khẩu không đúng");
  }
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    recordFail(normalized);
    throw unauthorized("Email hoặc mật khẩu không đúng");
  }
  if (!user.is_active) {
    throw unauthorized("Tài khoản đã bị vô hiệu hóa");
  }
  clearAttempts(normalized);
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const session = await pool.query(
    `INSERT INTO auth_sessions (user_id, expires_at) VALUES ($1, $2) RETURNING id, expires_at`,
    [user.id, expiresAt]
  );
  const sid = session.rows[0].id;
  const token = jwt.sign({ sid, sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  return {
    token,
    expiresAt: session.rows[0].expires_at,
    user: publicUser({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      role: user.role,
      homeDepartmentId: user.home_department_id,
      serviceDepartmentId: user.service_department_id,
    }),
  };
}

async function logout(sessionId) {
  if (!sessionId) return;
  await pool.query(
    `UPDATE auth_sessions SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL`,
    [sessionId]
  );
}

module.exports = { login, logout };
