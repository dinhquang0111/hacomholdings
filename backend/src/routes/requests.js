const express = require("express");
const multer = require("multer");
const requestService = require("../services/requestService");
const { performAction } = require("../services/workflowService");
const { listComments, addComment } = require("../services/commentService");
const { addAttachment, listAttachments } = require("../services/attachmentService");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const router = express.Router();

router.get("/request-types", async (_req, res, next) => {
  try {
    res.json({ items: await requestService.listRequestTypes() });
  } catch (error) {
    next(error);
  }
});

router.get("/departments/:id/agents", async (req, res, next) => {
  try {
    res.json({ items: await requestService.listAgents(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/requests", async (req, res, next) => {
  try {
    const { request, replayed } = await requestService.createRequest(req.user, {
      title: req.body?.title,
      description: req.body?.description,
      requestTypeId: req.body?.requestTypeId || req.body?.request_type_id,
      priority: req.body?.priority,
      clientRequestId: req.body?.clientRequestId || req.body?.client_request_id,
    });
    res.status(replayed ? 200 : 201).json({ request, replayed });
  } catch (error) {
    next(error);
  }
});

router.get("/requests", async (req, res, next) => {
  try {
    res.json(await requestService.listRequests(req.user, req.query));
  } catch (error) {
    next(error);
  }
});

router.get("/requests/:id", async (req, res, next) => {
  try {
    res.json({ request: await requestService.getRequest(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
});

router.get("/requests/:id/events", async (req, res, next) => {
  try {
    res.json({ items: await requestService.listEvents(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/requests/:id/actions/:action", async (req, res, next) => {
  try {
    const request = await performAction(req.user, req.params.id, req.params.action, req.body || {});
    res.json({ request });
  } catch (error) {
    next(error);
  }
});

router.get("/requests/:id/comments", async (req, res, next) => {
  try {
    res.json({ items: await listComments(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/requests/:id/comments", async (req, res, next) => {
  try {
    const comment = await addComment(req.user, req.params.id, req.body?.content);
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
});

router.get("/requests/:id/attachments", async (req, res, next) => {
  try {
    res.json({ items: await listAttachments(req.user, req.params.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/requests/:id/attachments", upload.single("file"), async (req, res, next) => {
  try {
    const attachment = await addAttachment(req.user, req.params.id, req.file);
    res.status(201).json({ attachment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
