const Story = require("../../models/story.model");
const Cart = require("../../models/cart.model");
const catchAsync = require("../../utils/catchAsync");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");

const getCart = async (req) => {
  if (req.user) {
    return await Cart.findOne({
      user: req.user._id,
    });
  }

  const guestId = req.headers["x-guest-id"];

  if (!guestId) {
    throw new ApiError(400, "Guest Id is required");
  }

  return await Cart.findOne({
    guestId,
  });
};

exports.saveStory = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const existingStory = await Story.findOne({
    cart: cart._id
});

let audio = existingStory?.audio || "";
let video = existingStory?.video || "";

  if (req.files?.audio && req.files?.video) {
  throw new ApiError(
    400,
    "Please upload either audio or video, not both"
  );
}

  if (req.files?.audio) {
    audio = req.files.audio[0].filename;
  }

  if (req.files?.video) {
    video = req.files.video[0].filename;
  }

  const storyType = req.body.storyType || "audio";

// Audio story me video allow nahi
if (
  storyType === "audio" &&
  req.files?.video
) {
  throw new ApiError(
    400,
    "Video is not allowed for audio story"
  );
}

// Video story me audio allow nahi
if (
  storyType === "video" &&
  req.files?.audio
) {
  throw new ApiError(
    400,
    "Audio is not allowed for video story"
  );
}

if (
  storyType === "audio" &&
  !audio
) {
  throw new ApiError(
    400,
    "Please upload audio"
  );
}

if (
  storyType === "video" &&
  !video
) {
  throw new ApiError(
    400,
    "Please upload video"
  );
}

  const story = await Story.findOneAndUpdate(
    {
      cart: cart._id,
    },

    {
      cart: cart._id,

      user: req.user ? req.user._id : null,

      guestId: req.user ? null : req.headers["x-guest-id"],

      enableQrVoice: req.body.enableQrVoice,

      recipientName: req.body.recipientName,

      relation: req.body.relation,

      occasionDate: req.body.occasionDate,

      occasion: req.body.occasion,

      otherOccasion: req.body.otherOccasion,

      storyType: storyType,

      qrCardText: req.body.qrCardText,

      allowPublicStory: req.body.allowPublicStory,

      audio,

      video,
    },

    {
      new: true,

      upsert: true,

      runValidators: true,
    },
  );

  res.status(200).json(
    new ApiResponse(
      200,

      story,

      "Story saved successfully",
    ),
  );
});

exports.getStory = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (!cart) {
    return res.status(200).json(
      new ApiResponse(
        200,

        null,

        "No story found",
      ),
    );
  }

  const story = await Story.findOne({
    cart: cart._id,
  });

  res.status(200).json(
    new ApiResponse(
      200,

      story,

      "Story fetched successfully",
    ),
  );
});

exports.deleteStory = catchAsync(async (req, res) => {
  const cart = await getCart(req);

  if (cart) {
    await Story.deleteOne({
      cart: cart._id,
    });
  }

  res.status(200).json(
    new ApiResponse(
      200,

      null,

      "Story deleted successfully",
    ),
  );
});

exports.updateStory = catchAsync(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new ApiError(
      404,

      "Story not found",
    );
  }

  if (req.files?.audio) {
    story.audio = req.files.audio[0].filename;
  }

  if (req.files?.video) {
    story.video = req.files.video[0].filename;
  }

  const storyType =
  req.body.storyType ||
  story.storyType;

  if (
  storyType === "audio" &&
  req.files?.video
) {
  throw new ApiError(
    400,
    "Video is not allowed for audio story"
  );
}

if (
  storyType === "video" &&
  req.files?.audio
) {
  throw new ApiError(
    400,
    "Audio is not allowed for video story"
  );
}

const audio =
  req.files?.audio
    ? req.files.audio[0].filename
    : story.audio;

const video =
  req.files?.video
    ? req.files.video[0].filename
    : story.video;

    if (
  storyType === "audio" &&
  !audio
) {
  throw new ApiError(
    400,
    "Please upload audio"
  );
}

if (
  storyType === "video" &&
  !video
) {
  throw new ApiError(
    400,
    "Please upload video"
  );
}

story.audio = audio;
story.video = video;

Object.assign(story, req.body);

await story.save();


  res.status(200).json(
    new ApiResponse(
      200,

      story,

      "Story updated successfully",
    ),
  );
});
