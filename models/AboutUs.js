const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
{
    icon: {
        type: String,
        default: ""
    },

    title: {
        type: String,
        default: ""
    },

    description: {
        type: String,
        default: ""
    }
},
{
    _id: false
});

const aboutUsSchema = new mongoose.Schema(
{
    // ==========================
    // Intro Section
    // ==========================
    introDescription: {
        type: String,
        default: ""
    },

    // ==========================
    // Brand Story
    // ==========================
    brandImage: {
        type: String,
        default: ""
    },

    brandHeading: {
        type: String,
        default: ""
    },

    brandSubHeading: {
        type: String,
        default: ""
    },

    brandDescription: {
        type: String,
        default: ""
    },

    // ==========================
    // Our Studio
    // ==========================
    studioHeading: {
        type: String,
        default: ""
    },

    studioSubHeading: {
        type: String,
        default: ""
    },

    studioDescription: {
        type: String,
        default: ""
    },

    studioImage1: {
        type: String,
        default: ""
    },

    studioImage2: {
        type: String,
        default: ""
    },

    studioImage3: {
        type: String,
        default: ""
    },

    // ==========================
    // Journey
    // ==========================

    journeyHeading: {
        type: String,
        default: ""
    },

    journey: {
        type: [journeySchema],
        default: [
            {},
            {},
            {},
            {}
        ]
    }

},
{
    timestamps: true
});

module.exports = mongoose.model(
    "AboutUs",
    aboutUsSchema
);