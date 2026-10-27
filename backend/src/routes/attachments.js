const express = require("express");
const path = require("path");
const { downloadAttachment } = require("../services/attachmentService");

const router = express.Router();

router.get("/attachments/:id/download", async (req, res, next) => {
  try {
    const file = await downloadAttachment(req.user, req.params.id);
    res.setHeader("Content-Type", file.mime);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(file.originalName)}"`
    );
    res.sendFile(path.resolve(file.filePath));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
