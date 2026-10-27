const { pool, withTransaction } = require("../db/pool");
const { badRequest } = require("../utils/errors");
const { loadRequestOr404, assertCanWriteConversation } = require("./access");

async function listComments(user, requestId) {
  await loadRequestOr404(pool, user, requestId);
  const result = await pool.query(
    `SELECT c.id, c.request_id, c.author_id, c.content, c.created_at, u.display_name AS author_name
     FROM request_comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.request_id = $1
     ORDER BY c.created_at ASC, c.id ASC`,
    [requestId]
  );
  return result.rows.map((row) => ({
    id: row.id,
    requestId: row.request_id,
    authorId: row.author_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  }));
}

async function addComment(user, requestId, content) {
  const text = String(content || "").trim();
  if (text.length < 1 || text.length > 2000) {
    throw badRequest("Bình luận phải từ 1 đến 2.000 ký tự");
  }
  return withTransaction(async (client) => {
    const request = await loadRequestOr404(client, user, requestId);
    await client.query(`SELECT id FROM requests WHERE id = $1 FOR UPDATE`, [requestId]);
    assertCanWriteConversation(request);
    const inserted = await client.query(
      `INSERT INTO request_comments (request_id, author_id, content)
       VALUES ($1,$2,$3)
       RETURNING id, request_id, author_id, content, created_at`,
      [requestId, user.id, text]
    );
    const row = inserted.rows[0];
    return {
      id: row.id,
      requestId: row.request_id,
      authorId: row.author_id,
      authorName: user.displayName,
      content: row.content,
      createdAt: row.created_at,
    };
  });
}

module.exports = { listComments, addComment };
