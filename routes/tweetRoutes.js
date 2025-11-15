const express = require("express");
const tweetController = require("../controllers/tweetController");
const authController = require("../controllers/authController");

const router = express.Router();

/*
router.get('/', (req, res)=> {
    res.send("List all tweets")
})
*/
router.get("/", tweetController.getAllTweets);
//router.get('/:id', tweetController.getTweet);
router.post(
  "/",
  authController.protect,
  tweetController.setUserId,
  tweetController.postTweet
  //authController.restrictTo("user"),
  //
);
router.post('/:tweetId/replies', authController.protect, tweetController.postReply);
//router.get('/:tweetId/replies', tweetController.getReplies);
//router.patch('/:tweetId/retweet', authController.protect, tweetController.toggleRetweet);
//router.get('/:tweetId/retweets', tweetController.getRetweets);
router.patch('/:tweetId/like', authController.protect, tweetController.toggleLike);
router.get('/:tweetId/likes', tweetController.getLikes);
//router.patch('/:tweetId/bookmark', authController.protect, tweetController.toggleBookmark);
//router.get('/:tweetId/bookmarks', tweetController.getBookmarks);
//router.delete('/:id', authController.protect, tweetController.deleteTour);


router.get('/feed', authController.protect, tweetController.getFeed);


module.exports = router;
