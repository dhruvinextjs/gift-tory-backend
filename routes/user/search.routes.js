const express = require("express");

const router = express.Router();

const {
    globalSearch
} = require("./../../controllers/user/globalSearchController");


// =====================================================
// GLOBAL SEARCH
// =====================================================

router.get("/search", globalSearch);


module.exports = router;