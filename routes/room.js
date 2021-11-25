const { Router } = require("express");
const {
  createRoom,
  getPublicRooms,
  getRoomsIn,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  joinRoom,
  exitRoom,
  searchRoom,
} = require("../controllers/roomController");
const { verifyAuthorization } = require("../middlewares/verifyToken");
const router = Router();

router.get("/", verifyAuthorization, getPublicRooms);
router.post("/", verifyAuthorization, createRoom);
router.get("/:_id", verifyAuthorization, getSingleRoom);
router.post("/search", verifyAuthorization, searchRoom);
router.get("/join", verifyAuthorization, getRoomsIn);
router.post("/join", verifyAuthorization, joinRoom);
router.post("/exit", verifyAuthorization, exitRoom);
router.put("/:_id", verifyAuthorization, updateRoom);
router.delete("/:_id", verifyAuthorization, deleteRoom);

module.exports = router;
