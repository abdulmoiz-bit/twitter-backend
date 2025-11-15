const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");


exports.ensureMutualFollow = async (userA, userB) => {
  const [user, other] = await Promise.all([
    User.findById(userA),
    User.findById(userB),
  ]);

  const canChat =
    user.following.includes(userB) && other.following.includes(userA);

  return canChat;
};

// 🟢 Create or fetch conversation
exports.getOrCreateConversation = async (userId, otherUserId) => {
  let convo = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!convo) {
    convo = await Conversation.create({ participants: [userId, otherUserId] });
  }

  return convo;
};

// 🟢 Save a message (used by both REST + Socket)
exports.createMessage = async ({ conversationId, senderId, text }) => {
  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
  });
  return message.populate("sender", "username");
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversation: conversationId })
    .populate("sender", "username")
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: { messages },
  });
};


/*
exports.initiateConversation = async (req, res) => {
  
  const userId = req.user.id;
  const otherUserId = req.params.userId;

  const user = await User.findById(userId);
  const otherUser = await User.findById(otherUserId);

  // check if other user exists
  if (!otherUser) {
    throw new Error("User not found");
  }

  // check If you follow the other user
  const canChat = user.following.includes(otherUserId);
  //const canChat = user.following.includes(otherUserId) && otherUser.following.includes(userId)
  if (!canChat) {
    return res.status(403).json({
      status: "fail",
      message: "You can only chat with users you followed.",
    });
  }

  // find existing conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, otherUserId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, otherUserId],
    });
  }
  res.status(201).json({
    status: "success",
    data: { conversation },
  });
};

exports.sendMessage = async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;

  const message = await Message.create({
    conversation: conversationId,
    sender: req.user.id,
    text,
  });

  res.status(201).json({
    status: "success",
    data: { message },
  });
};
*/

