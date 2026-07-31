const CancelRequest = require("../../models/orderCancel.model");
const catchAsync = require("../../utils/catchAsync");
const ApiResponse = require("../../utils/ApiResponse");

exports.getAllCancelRequests = catchAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const total = await CancelRequest.countDocuments(filter);

    const requests = await CancelRequest.find(filter)
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
            "Cancel requests fetched successfully"
        )
    );
});

exports.renderCancelRequests = catchAsync(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const total = await CancelRequest.countDocuments(filter);

    const requests = await CancelRequest.find(filter)
        .populate("user", "name email phone")
        .populate("order", "orderNumber totalPrice createdAt")
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);

    res.render("admin/cancel-requests/index", {
        title: "Cancel Requests",
        active: "cancel",
        requests,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        status: req.query.status || ""
    });

});



exports.renderCancelRequestDetail = catchAsync(async (req, res) => {

    const request = await CancelRequest.findById(req.params.id)
        .populate("user")
        .populate("order");

    if (!request) {
        return res.redirect("/admin/cancel-requests");
    }

    res.render("admin/cancel-requests/view", {
        title: "Cancel Request Details",
        active: "cancel",
        request
    });

});

exports.updateCancelRequestStatus = catchAsync(async (req, res) => {

    const { status } = req.body;

    await CancelRequest.findByIdAndUpdate(
        req.params.id,
        { status }
    );

    res.redirect("/admin/cancel-requests/" + req.params.id);

});