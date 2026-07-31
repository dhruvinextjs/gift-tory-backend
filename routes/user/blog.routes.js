const express = require("express");
const router = express.Router();
const blogController = require("../../controllers/user/blog.controller");

router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogBySlug);

module.exports = router;
