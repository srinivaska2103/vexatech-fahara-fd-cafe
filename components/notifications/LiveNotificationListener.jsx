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
      // Security check: Ignore notification if it was not meant for this user
      if (notification.user_id && notification.user_id !== user.id) {
        return;
      }
      console.log('[LiveNotificationListener] Received live notification for current user:', notification);
      
      // Invalidate React Query cache so notification list updates instantly without refresh!
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });

      // Show modern popup toast for live notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border border-[#EF5350]/60 overflow-hidden p-4 space-x-3 text-[#252525]`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#E50914] text-white flex items-center justify-center font-extrabold shrink-0 shadow-xs">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-[#252525]">
                  {notification.title || 'New Notification'}
                </p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E50914]/10 text-[#E50914]">
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

    const handleUserEvent = (payload) => {
      if (payload?.userId === user.id) {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      }
    };

    socket.on('new_notification', handleNewNotification);
    socket.on('user_notification_event', handleUserEvent);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('new_notification', handleNewNotification);
      socket.off('user_notification_event', handleUserEvent);
    };
  }, [user?.id, queryClient]);

  return null;
}
