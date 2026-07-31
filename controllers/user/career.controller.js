const Career = require("../../models/career.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

exports.getCareers = catchAsync(async (req, res) => {

    const careers = await Career.find({
        isActive: true
    })
    .sort({
        displayOrder: 1,
        createdAt: -1
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            careers,
            "Careers fetched successfully."
        )
    );

});