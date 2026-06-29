const notificationRepository = require('../repositories/notificationRepository');
const { success, error } = require('../utils/apiResponse');

async function getMyNotifications(req, res) {
  const notifications = await notificationRepository.findByUserId(req.user.id);
  return success(res, notifications, 'Notifications retrieved successfully');
}

async function markAsRead(req, res) {
  const notification = await notificationRepository.markAsRead(req.params.id);
  if (!notification) {
    return error(res, 'Notification not found', 404);
  }
  return success(res, notification, 'Notification marked as read');
}

async function markAllRead(req, res) {
  const notifications = await notificationRepository.markAllAsRead(req.user.id);
  return success(res, notifications, 'All notifications marked as read');
}

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllRead,
};
