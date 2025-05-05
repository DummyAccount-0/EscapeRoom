import React, { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

const Notifications: React.FC = () => {
  const notifications = useGameStore(state => state.notifications);
  const removeNotification = useGameStore(state => state.removeNotification);
  
  useEffect(() => {
    // Automatically remove notifications after 5 seconds
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="absolute top-20 right-4 flex flex-col space-y-2 max-w-xs">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`px-4 py-2 rounded-md text-white animate-fadeIn ${
            notification.type === 'success' 
              ? 'bg-green-600' 
              : notification.type === 'error' 
              ? 'bg-red-600' 
              : 'bg-blue-600'
          }`}
        >
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;