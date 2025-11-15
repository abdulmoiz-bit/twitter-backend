const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
//const tweetController = require("../controllers/tweetController");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.post("/signup", authController.createUser);
router.post("/login", authController.login);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);


router.get("/:id/tweets", userController.getUserTweets);

// this route can be in simple useTweet
router.get("/:id/tweets/:tweetId", userController.getSpecificUserTweet);

//router.get("/:id/replies", userController.getUserReplies);
//router.get("/:id/likes", userController.getUserLikes);
//router.get("/:id/bookmarks", userController.getUserBookmarks);
//router.delete('/:id', authController.protect, userController.deleteUser);

router.patch('/:id/follow', authController.protect, userController.toggleFollow);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);


//router.post('/conversation/:userId', authController.protect, userController.initiateConversation);
//router.post('/message/:conversationId', authController.protect, userController.sendMessage);
router.get('/messages/:conversationId', authController.protect, chatController.getMessages);


// Create or fetch conversation
router.post(
  "/conversation/:userId",
  authController.protect,
  async (req, res) => {
    const canChat = await chatController.ensureMutualFollow(
      req.user.id,
      req.params.userId
    );
    if (!canChat)
      return res
        .status(403)
        .json({ status: "fail", message: "You must follow each other first" });

    const conversation = await chatController.getOrCreateConversation(
      req.user.id,
      req.params.userId
    );

    res.status(200).json({ status: "success", data: { conversation } });
  }
);

// Send a message via REST
router.post(
  "/message/:conversationId",
  authController.protect,
  async (req, res) => {
    const message = await chatController.createMessage({
      conversationId: req.params.conversationId,
      senderId: req.user.id,
      text: req.body.text,
    });

    res.status(201).json({ status: "success", data: { message } });
  }
);

module.exports = router;


module.exports = router;