const { Router } = require("express");
const {
  getLogin,
  loginUser,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { registerCheck, loginCheck } = require("../middlewares/validate");
const {
  verifyAuthorization,
  verifyAuthorized,
} = require("../middlewares/verifyToken");
const router = Router();

router.get("/login", verifyAuthorized, getLogin);
router.post("/login", loginCheck, loginUser);
router.post("/signup", registerCheck, registerUser);
// router.get("/:_id", verifyAuthorization, getUser);
router.put("/:_id", verifyAuthorization, updateUser);
router.delete("/:_id", verifyAuthorization, deleteUser);

module.exports = router;
