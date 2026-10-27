const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { pool, withTransaction } = require("../db/pool");
const config = require("../config");
const { detectFileType } = require("../utils/hash");
const {
  badRequest,
  payloadTooLarge,
  unsupportedMedia,
  notFound,
} = require("../utils/errors");
const { loadRequestOr404, assertCanWriteConversation, canView } = require("./access");

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

async function addAttachment(user, requestId, file) {
  if (!file) {
    throw badRequest("Thiếu tệp tải lên");
  }
  if (file.size > MAX_BYTES) {
    throw payloadTooLarge("Tệp vượt quá 5 MiB");
  }
  const detected = detectFileType(file.buffer);
  if (!detected) {
    throw unsupportedMedia("Chỉ chấp nhận PNG, JPEG hoặc PDF");
  }
  const storageKey = `${crypto.randomUUID()}.${detected.ext}`;
  const dest = path.join(config.uploadDir, storageKey);
  await fs.mkdir(config.uploadDir, { recursive: true });

  let stored = false;
  try {
    await fs.writeFile(dest, file.buffer);
    stored = true;
    return await withTransaction(async (client) => {
      const request = await loadRequestOr404(client, user, requestId);
      await client.query(`SELECT id FROM requests WHERE id = $1 FOR UPDATE`, [requestId]);
      assertCanWriteConversation(request);
      const count = await client.query(
        `SELECT COUNT(*)::int AS n FROM request_attachments WHERE request_id = $1`,
        [requestId]
      );
      if (count.rows[0].n >= MAX_FILES) {
        throw badRequest("Mỗi hồ sơ tối đa 5 tệp đính kèm");
      }
      const inserted = await client.query(
        `INSERT INTO request_attachments (
           request_id, uploaded_by, original_name, storage_key, detected_type, size_bytes
         ) VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [requestId, user.id, path.basename(file.originalname || `file.${detected.ext}`), storageKey, detected.mime, file.size]
      );
      const row = inserted.rows[0];
      return {
        id: row.id,
        requestId: row.request_id,
        uploadedBy: row.uploaded_by,
        originalName: row.original_name,
        detectedType: row.detected_type,
        sizeBytes: row.size_bytes,
        createdAt: row.created_at,
      };
    });
  } catch (error) {
    if (stored) {
      await fs.unlink(dest).catch(() => {});
    }
    throw error;
  }
}

async function listAttachments(user, requestId) {
  await loadRequestOr404(pool, user, requestId);
  const result = await pool.query(
    `SELECT id, request_id, uploaded_by, original_name, detected_type, size_bytes, created_at
     FROM request_attachments WHERE request_id = $1 ORDER BY created_at ASC`,
    [requestId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    requestId: row.request_id,
    uploadedBy: row.uploaded_by,
    originalName: row.original_name,
    detectedType: row.detected_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  }));
}

async function downloadAttachment(user, attachmentId) {
  const result = await pool.query(
    `SELECT a.*, r.created_by, r.assigned_to, r.handling_department_id, r.status
     FROM request_attachments a
     JOIN requests r ON r.id = a.request_id
     WHERE a.id = $1`,
    [attachmentId]
  );
  const row = result.rows[0];
  if (!row || !canView(user, row)) {
    throw notFound("Không tìm thấy tệp");
  }
  const filePath = path.join(config.uploadDir, row.storage_key);
  return {
    filePath,
    originalName: row.original_name,
    mime: row.detected_type,
  };
}

module.exports = { addAttachment, listAttachments, downloadAttachment };
