const express = require("express");

const router = express.Router();

const storyController = require("../../controllers/user/story.controller");

const upload = require("../../middlewares/multer.middleware");

const { optionalUser } = require("../../middlewares/auth.middleware");

const uploadStory = upload("stories");

router.post(
  "/",

  optionalUser,

  uploadStory.fields([
    {
      name: "audio",
      maxCount: 1,
    },

    {
      name: "video",
      maxCount: 1,
    },
  ]),

  storyController.saveStory,
);

router.get(
  "/",

  optionalUser,

  storyController.getStory,
);

router.put(
  "/:id",

  optionalUser,

  uploadStory.fields([
    {
      name: "audio",
      maxCount: 1,
    },

    {
      name: "video",
      maxCount: 1,
    },
  ]),

  storyController.updateStory,
);

router.delete(
  "/",

  optionalUser,

  storyController.deleteStory,
);

module.exports = router;
