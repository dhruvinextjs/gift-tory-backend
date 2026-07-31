const Faq = require("../../models/faq.model");

exports.getFaqs = async (req, res) => {

  try {

    const faqs = await Faq.find({

      isActive: true,

    }).sort({

      order: 1,

    });

    return res.status(200).json({

      success: true,

      message: "FAQs fetched successfully",

      data: faqs,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Internal Server Error",

    });

  }

};