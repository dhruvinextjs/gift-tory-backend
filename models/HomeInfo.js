const mongoose = require("mongoose");

const infoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const homeInfoSchema = new mongoose.Schema(
  {
    infos: {
      type: [infoSchema],
      default: [
        {
          value: "10,000+",
          title: "Happy Customer",
        },
        {
          value: "100%",
          title: "Secure Payment",
        },
        {
          value: "1000+",
          title: "Cities Happily Delivering",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HomeInfo", homeInfoSchema);