const express = require("express");

const {
  filterProducts,
} = require("../../controllers/user/productFilterController");

const router = express.Router();

// Filter products
router.get("/filter", filterProducts);

module.exports = router;