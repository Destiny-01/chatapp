const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Message = require("../models/Message");
const Room = require("../models/Room");
require("dotenv").config();

exports.createRoom = async (req, res) => {
  try {
    const newRoom = new Room({
      ...req.body,
      room_id: uuidv4(),
      owner: req.user.id,
      users: [req.user.id],
    });

    const existingRoom = await Room.findOne({ room_id: newRoom.room_id });

    if (existingRoom) {
      req.flash("error", "Room id is in use. Please try again");
      return res.redirect("/rooms");
    }

    await newRoom.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { roomsIn: newRoom } });

    req.flash("success", "Created Room successfully");
    res.redirect(`/rooms/${newRoom.room_id}`);
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getPublicRooms = async (req, res) => {
  try {
    const publicRooms = await Room.find({ type: "public" })
      .sort({ createdAt: "desc" })
      .limit(10);

    res.render("rooms", {
      layout: "layouts/layout",
      error: req.flash("error"),
      success: req.flash("success"),
      rooms: publicRooms,
    });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getRoomsIn = async (req, res) => {
  const user = req.user.id;
  try {
    const rooms = await Room.find({ user: { $in: { users } } });

    res.json({ rooms });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.joinRoom = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    const room = await Room.findOne({ room_id });

    if (!room) {
      req.flash("error", "Room not found");
      return res.redirect("/rooms");
    }

    if (room.users.includes(req.user.id)) {
      req.flash("error", "Already in the room");
      return res.redirect(`/rooms/${room_id}`);
    }

    // socketio stuff

    await Room.findOneAndUpdate({ room_id }, { $push: { users: req.user.id } });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { roomsIn: room.room_id },
    });

    req.flash("success", "Joined Room successfully");
    res.redirect(`/rooms/${room_id}`);
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.exitRoom = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    const room = await Room.findOne({ room_id });

    if (!room) {
      req.flash("error", "Room not found");
      return res.redirect("/rooms");
    }

    // socketio stuff

    await Room.findOneAndUpdate({ room_id }, { $pull: { users: req.user.id } });

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { roomsIn: room.room_id },
    });

    req.flash("success", "Exited Room successfully");

    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.updateRoom = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    const room = await Room.findOne({ room_id });
    if (!req.user.id === room.owner) {
      req.flash("error", "You are not allowed to do that");
      return res.redirect("/rooms");
    }

    await Room.findOneAndUpdate({ room_id }, req.body);

    req.flash("success", "Updated Room successfully");
    res.redirect(`/rooms/${room_id}`);
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.deleteRoom = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    if (!req.user.id === room.owner) {
      req.flash("error", "You are not allowed to do that");
      return res.redirect("/rooms");
    }
    const room = await Room.findOne({ room_id });
    if (!room) {
      return res.redirect("/rooms");
    }

    await User.updateMany(
      { roomsIn: [room_id] },
      { $pull: { roomsIn: room_id } }
    );
    await Message.deleteMany({ room_id });
    await Room.findOneAndDelete({ room_id });

    req.flash("success", "Deleted Room successfully");

    res.redirect("/rooms");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getSingleRoom = async (req, res) => {
  const room_id = req.params.room_id;
  try {
    const room = await Room.findOne({ room_id });

    res.render("room", { room });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.searchRoom = async (req, res) => {
  const { query } = req.query;
  let rooms;
  try {
    if (query.length == 36) {
      rooms = await Room.find({ room_id: query });
    } else {
      rooms = await Room.find({ name: query });
    }

    // console.log("hoii", rooms);
    return res.json({ rooms });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};
