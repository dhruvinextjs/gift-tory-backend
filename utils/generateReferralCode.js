const User = require("../models/user.model");

const generateReferralCode = async () => {

    let code;
    let exists = true;

    while (exists) {

        const random = Math.floor(
            100000 + Math.random() * 900000
        );

        code = `GIFT${random}`;

        exists = await User.exists({
            referralCode: code
        });

    }

    return code;

};

module.exports = generateReferralCode;