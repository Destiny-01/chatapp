const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
    required: true,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  users: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
