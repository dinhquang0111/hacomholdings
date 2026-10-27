const crypto = require("crypto");

function payloadHash({ title, description, requestTypeId, priority }) {
  const canonical = JSON.stringify({
    title: String(title).trim(),
    description: String(description).trim(),
    requestTypeId,
    priority,
  });
  return crypto.createHash("sha256").update(canonical).digest("hex");
}

function detectFileType(buffer) {
  if (!buffer || buffer.length < 8) return null;
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { mime: "image/png", ext: "png" };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
    return { mime: "application/pdf", ext: "pdf" };
  }
  return null;
}

module.exports = { payloadHash, detectFileType };
