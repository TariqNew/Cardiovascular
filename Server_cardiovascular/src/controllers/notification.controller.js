const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationController {
  // Fetch notifications for the authenticated user
  async getNotifications(req, res) {
    const { userId } = req.user; // Assumes req.user is set by middleware

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { time: 'desc' },
        take: 20,
      });

      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }
}

module.exports = NotificationController;
