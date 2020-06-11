const { Router } = require("express");
const router = Router();

const { isAuth } = require("../controllers/auth");
const { short, get } = require("../controllers/url.controller");

/**
 * SHORT URL.
 */
router.post("/shorten", isAuth, short);
router.get("/shorten/:urlCode", isAuth, get);

module.exports = router;
