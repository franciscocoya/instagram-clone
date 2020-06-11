const { Router } = require("express");
const router = Router();

const { isAuth } = require("../controllers/auth");
const {
  short,
  get,
  getCodeByPostId,
} = require("../controllers/url.controller");

/**
 * SHORT URL.
 */
router.post("/shorten", isAuth, short);
router.get("/shorten/:urlCode", isAuth, get);
router.get("/shorten/get/:postId", isAuth, getCodeByPostId);

module.exports = router;
