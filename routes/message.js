const { Router } = require("express");
const {
  getMessagesForRoom,
  getSingleMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { verifyAuthorization } = require("../middlewares/verifyToken");
const router = Router();

router.post("/", verifyAuthorization, createMessage);
router.get("/", verifyAuthorization, getMessagesForRoom);
router.get("/:_id", verifyAuthorization, getSingleMessage);
router.put("/:_id", verifyAuthorization, updateMessage);
router.delete("/:_id", verifyAuthorization, deleteMessage);

module.exports = router;
