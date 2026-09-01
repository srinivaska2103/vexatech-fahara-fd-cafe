'use client';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';
import { Bell, Sparkles } from 'lucide-react';

export function LiveNotificationListener() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id) return;

    const socket = getSocket();

    const joinRoom = () => {
      socket.emit('join_user', user.id);
      console.log('[LiveNotificationListener] Joined WebSocket room for user:', user.id);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on('connect', joinRoom);
    }

    const handleNewNotification = (notification) => {
      console.log('[LiveNotificationListener] Received live notification via WebSocket:', notification);
      
      // Invalidate React Query cache so notification list updates instantly without refresh!
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });

      // Show modern popup toast for live notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-[#DDB892]/60 overflow-hidden p-4 space-x-3 text-[#2C1810]`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-extrabold shrink-0 shadow-xs">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-[#2C1810]">
                  {notification.title || 'New Notification'}
                </p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37]">
                  JUST NOW
                </span>
              </div>
              <p className="text-xs text-text/70 line-clamp-2">
                {notification.message}
              </p>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    };

    const handleGlobalEvent = (payload) => {
      if (payload?.userId === user.id) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      }
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('global_notification_event', handleGlobalEvent);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('new_notification', handleNewNotification);
      socket.off('global_notification_event', handleGlobalEvent);
    };
  }, [user?.id, queryClient]);

  return null;
}
