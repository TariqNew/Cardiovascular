import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Notification {
  id: number;
  title: string;
  description: string;
  type: string;
  time: string;
  read: boolean;
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace this with your auth token or user ID as needed
  const authToken = localStorage.getItem('token'); // example: token stored in localStorage

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5050/api/notifications/notification`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // send token or userId in header
          },
        });

        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          setNotifications([]);
          setError('Invalid data received');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [authToken]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:5050/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
        </div>

        {error && (
          <div className="px-4 py-2 text-red-500 text-center">{error}</div>
        )}

        {notifications.length === 0 ? (
          <div className="px-4 py-3 text-gray-500 text-center">No notifications</div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-gray-100' : ''
                }`}
                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    !notification.read && handleMarkAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i
                      className={`fas ${
                        notification.type === 'MEAL_PLAN'
                          ? 'fa-utensils text-green-500'
                          : notification.type === 'HEALTH_TIP'
                          ? 'fa-heartbeat text-red-500'
                          : 'fa-info-circle text-gray-500'
                      }`}
                    ></i>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {dayjs(notification.time).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200">
          <button className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-gray-100 cursor-pointer">
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
