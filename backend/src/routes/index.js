const { Router } = require("express");
const router = Router();

//Users
const {
  updateUser,
  getUser,
  deleteUser,
  listUsers,
  getUserJWT,
  getUserInitialization,
  initUser,
  getUserByUsername,
  searchByPartialText,
} = require("../controllers/users.controller");

const { signIn, signUp, isAuth } = require("../controllers/auth");

//Posts
const {
  addPost,
  getPost,
  updatePost,
  deletePost,
  listPosts,
  listPostByUserId,
  countPosts,
  getLikesByPostId,
  listLastRelatedPostsByUserId,
  listPostsByLocation,
  getAllLocations,
  getCoordinatesByLocation,
  getFeaturePostByLocation,
} = require("../controllers/posts.controller");

//Likes
const {
  addLike,
  deleteLike,
  listLikes,
  getLike,
} = require("../controllers/likes.controller");

//Comments
const {
  addComment,
  updateComment,
  deleteComment,
  getComment,
  listComments,
  countComments,
  listLastTwoComments,
} = require("../controllers/comments.controller");

//Comment Replies

const {
  addCommentReply,
  deleteCommentReply,
  listCommentReplies,
} = require("../controllers/commentReply.controller");

//Follows
const {
  follow,
  unfollow,
  getFollow,
  listFollows,
  listFollowedBy,
  getAllFollows,
  isFollowing,
} = require("../controllers/follows.controller");

//Messages
const {
  addMessage,
  removeMessage,
  getMessage,
  listMessages,
  listUsersChat,
  getConversationUsers,
} = require("../controllers/messages.controller");

//Saved Post
const {
  addSavedPost,
  deleteSavedPost,
  getSavedPost,
  listSavedPost,
} = require("../controllers/savePost.controller");

//Mixed queries
const {
  listFollowingPost,
  listUsersNotFollow,
  listNotFollowingPost,
  listPostUserLikes,
} = require("../controllers/mix.controller");

/**
 * USERS ROUTES
 */

router.post("/accounts/SignUp", signUp);
router.post("/accounts/SignIn", signIn);
router.get("/accounts/user/init/:username", isAuth, getUserJWT);
router.get("/accounts/user/init", isAuth, getUserInitialization);
router.get("/accounts/user/profile/init", isAuth, initUser);
router.get("/accounts/user/:userId", isAuth, getUser);
router.get("/accounts/user/username/:otherUsername", isAuth, getUserByUsername);
router.put("/accounts/user/:userId", isAuth, updateUser);
router.delete("/accounts/user/:userId", isAuth, deleteUser);
router.get("/users", isAuth, listUsers);
router.get("/user/search/:textToSearch", isAuth, searchByPartialText);

/**
 * POSTS ROUTES
 */

router.post("/p/uploadPost", isAuth, addPost);
router.get("/p/:postId", isAuth, getPost);
router.put("/p/:postId", isAuth, updatePost);
router.delete("/p/:postId", isAuth, deletePost);
router.get("/posts", isAuth, listPosts);
router.get("/posts/:userId", isAuth, listPostByUserId);
router.get("/posts/coords/:placeName", isAuth, getCoordinatesByLocation);
router.get("/posts/place/:placeName", isAuth, listPostsByLocation);
router.get("/posts/c", isAuth, countPosts);
router.get("/posts/likes/:postId", isAuth, getLikesByPostId);
router.get("/posts/related/:userId", isAuth, listLastRelatedPostsByUserId); //Return the last posts (max: 6)
router.get("/posts/all/allLocations", isAuth, getAllLocations);
router.get("/posts/feature/:placeName", isAuth, getFeaturePostByLocation);

/**
 * COMMENTS ROUTES
 */
router.post("/p/comment/add", isAuth, addComment);
router.get("/p/comment/:commentId", isAuth, getComment);
router.put("/p/comment/:commentId", isAuth, updateComment);
router.delete("/p/comment/:commentId", isAuth, deleteComment);
router.get("/comments/:postId", isAuth, listComments);
router.get("/comments/c/:postId", isAuth, countComments);
router.get("/p/comments/last/:postId", isAuth, listLastTwoComments);

/**
 * COMMENT REPLIES ROUTES
 */
router.post("/p/commentReply/addReply", isAuth, addCommentReply);
router.delete("/p/commentReply/:commentReply", isAuth, deleteCommentReply);
router.get("/p/commentReply/list/:comment_id", isAuth, listCommentReplies);

/**
 * LIKES ROUTES
 */
router.post("/p/like/add", isAuth, addLike);
router.delete("/p/like/remove/:likeId", isAuth, deleteLike);
router.get("/p/likes/get", isAuth, getLike);
router.get("/p/likes/:postId", isAuth, listLikes);

/**
 * FOLLOW ROUTES
 */
router.post("/follow/add", isAuth, follow);
router.delete("/follow/unfollow", isAuth, unfollow);
router.post("/follow/get", isAuth, getFollow);
router.get("/follow/allFollows", isAuth, getAllFollows);
router.get("/follow/listFollows/:userId", isAuth, listFollows);
router.get("/follow/listFollowedBy/:userId", isAuth, listFollowedBy);
router.post("/follow/isFollowing", isAuth, isFollowing);

/**
 * MESSAGES ROUTES
 */
router.post("/direct/msg/add", isAuth, addMessage);
router.delete("/direct/msg/:msgId", isAuth, removeMessage);
router.get("/direct/msg/:msgId", isAuth, getMessage);
router.post("/direct/msg/list", isAuth, listMessages);
router.post("/direct/msg/listUsers", isAuth, listUsersChat);
router.post("/direct/msg/getUsers", isAuth, getConversationUsers);

/**
 * SAVED POST ROUTES
 */
router.post("/p/savedPost/add", isAuth, addSavedPost);
router.delete("/p/savedPost/delete/:postSavedId", isAuth, deleteSavedPost);
router.get("/p/savedPost/get/:postId/:userId", isAuth, getSavedPost);
router.get("/p/savedPost/get/list/p/:userId", isAuth, listSavedPost);

/**
 * OTHER ROUTES
 */
router.post("/p/list/followingPosts", isAuth, listFollowingPost);
router.get("/follow/listUsersNotFollow/:userId", isAuth, listUsersNotFollow);
router.post("/follow/notFollowingPosts", isAuth, listNotFollowingPost);
router.get("/user/p/likes/:userId", isAuth, listPostUserLikes);

module.exports = router;
