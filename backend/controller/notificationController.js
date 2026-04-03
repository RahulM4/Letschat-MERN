const asyncWrapper = require("../middleWare/asyncWrapper");
const NotificationModel = require("../model/NotificationModel");
const ErrorHandler = require("../appUtills/error");

exports.getNotifications = asyncWrapper(async (req, res, next) => {
  const notifications = await NotificationModel.find({
    receiver: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name pic")
    .populate({
      path: "chat",
      select: "chatName isGroupChat users",
      populate: {
        path: "users",
        select: "name pic email",
      },
    });

  res.json(notifications);
});

exports.markAsRead = asyncWrapper(async (req, res, next) => {
  const notification = await NotificationModel.findOneAndDelete({
    _id: req.params.id,
    receiver: req.user._id,
  });

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  res.json({ success: true });
});
