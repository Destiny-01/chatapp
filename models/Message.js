const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Room",
  },
  message: {
    type: String,
    required: true,
  },
  author_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  readBy: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", messageSchema);
