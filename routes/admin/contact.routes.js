const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/admin/contact.controller");
const { protectAdmin } = require("../../middlewares/adminAuth.middleware");

router.use(protectAdmin);

router.get("/", contactController.getAllContactsApi);
router.put("/:id/status", contactController.updateContactStatusApi);
router.delete("/:id", contactController.deleteContactApi);

module.exports = router;
