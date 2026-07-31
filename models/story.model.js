const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    // Logged In User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Guest User
    guestId: {
      type: String,
      default: null,
    },

    // Cart
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
      unique: true,
    },

    // QR Voice Enable
    enableQrVoice: {
      type: Boolean,
      default: false,
    },

    // Recipient
    recipientName: {
      type: String,
      trim: true,
      default: "",
    },

    // Relation
    relation: {
      type: String,
      trim: true,
      default: "",
    },

    // Occasion Date
    occasionDate: {
      type: Date,
      default: null,
    },

    // Occasion
    occasion: {
      type: String,
      enum: [
        "Birthday",
        "Anniversary",
        "Wedding",
        "Baby Shower",
        "Valentine",
        "Festival",
        "Other",
      ],
      default: "Other",
    },

    // If Other selected
    otherOccasion: {
      type: String,
      trim: true,
      default: "",
    },

    // Story Type
    storyType: {
      type: String,
      enum: ["audio", "video"],
      default: "audio",
    },

    // Uploaded Audio
    audio: {
      type: String,
      default: "",
    },

    // Uploaded Video
    video: {
      type: String,
      default: "",
    },

    // QR Card Text
    qrCardText: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    // Public Story Checkbox
    allowPublicStory: {
      type: Boolean,
      default: false,
    },

    // Preview Image (optional)
    previewImage: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Story", storySchema);