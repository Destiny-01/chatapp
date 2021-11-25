const Message = require("../models/Message");
require("dotenv").config();

exports.createMessage = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    const newMessage = new Message({
      ...req.body,
      room_id,
      author_id: req.user.id,
    });

    // socketio stuff

    await newMessage.save();

    return;
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getMessagesForRoom = async (req, res) => {
  const room_id = req.query.room_id;
  try {
    const messages = await Message.find({ room_id });

    return res.render("room", { messages });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.getSingleMessage = async (req, res) => {
  const _id = req.params._id;
  try {
    const message = await Message.findById(_id);

    return res.render("room", { message });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.updateMessage = async (req, res) => {
  const _id = req.params._id;
  try {
    const message = await Message.findById(id);
    if (!req.user.id === message.author_id) {
      return res.render("login", {
        status: "error",
        message: "you are not allowed to do that",
      });
    }

    await Message.findByIdAndUpdate(_id, {
      message: req.body.message,
      isEdited: true,
    });

    return res.render("room", { message });
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};

exports.deleteMessage = async (req, res) => {
  const _id = req.params._id;
  try {
    const message = await Message.findById(_id);
    if (!req.user.id === message.author_id) {
      return res.render("login", {
        status: "error",
        message: "you are not allowed to do that",
      });
    }

    await Message.findByIdAndDelete(_id);

    return res.render("room");
  } catch (err) {
    console.log(err);
    return res.render("error/500");
  }
};
