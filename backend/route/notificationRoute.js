const express = require("express");
const { getNotifications, markAsRead } = require("../controller/notificationController");
const { authentication } = require("../middleWare/auth");
const router = express.Router();

router.route("/").get(authentication, getNotifications);
router.route("/:id").delete(authentication, markAsRead);

module.exports = router;
