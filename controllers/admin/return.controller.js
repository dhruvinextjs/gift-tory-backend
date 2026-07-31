const ReturnRequest = require("../../models/returnRequest.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

exports.getAllReturnRequests = catchAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const total = await ReturnRequest.countDocuments(filter);

    const requests = await ReturnRequest.find(filter)

        .populate("user", "name email phone")

        .populate("order", "orderNumber totalPrice createdAt")

        .sort("-createdAt")

        .skip(skip)

        .limit(limit);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                requests,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            },
            "Return requests fetched successfully"
        )
    );

});


exports.renderReturnRequests = catchAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const total = await ReturnRequest.countDocuments(filter);

    const requests = await ReturnRequest.find(filter)
        .populate("user", "name email phone")
        .populate("order", "orderNumber totalPrice createdAt")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);

    res.render("admin/returns/index", {

        layout: "admin/layout/main",

        title: "Return Requests",

        active: "returns",

        adminName: req.session?.admin?.name || "Admin",

        success: req.flash ? req.flash("success") : [],

        error: req.flash ? req.flash("error") : [],

        requests,

        currentPage: page,

        totalPages: Math.ceil(total / limit),

        status: req.query.status || ""

    });

});