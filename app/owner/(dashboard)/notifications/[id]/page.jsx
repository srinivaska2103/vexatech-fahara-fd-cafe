'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useNotification, 
  useMarkAsRead,
  useDeleteNotification 
} from '@/hooks/notification';
import { NotificationDetails } from '@/components/notifications/NotificationDetails';
import { NotificationTimeline } from '@/components/notifications/NotificationTimeline';
import { DeleteNotificationDialog } from '@/components/notifications/DeleteNotificationDialog';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Trash2, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Queries
  const { data: notificationData, isLoading, isError } = useNotification(id);
  
  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const deleteMutation = useDeleteNotification();

  // State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  React.useEffect(() => {
    // Automatically mark as read if it's unread and successfully fetched
    if (notificationData?.data && !notificationData.data.is_read) {
       markAsReadMutation.mutate(id);
    }
  }, [notificationData]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 animate-pulse space-y-6">
         <div className="h-10 w-32 bg-surface rounded-lg mb-4" />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-[400px] bg-surface rounded-3xl" />
           <div className="lg:col-span-1 h-[400px] bg-surface rounded-3xl" />
         </div>
      </div>
    );
  }

  if (isError || !notificationData?.data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="ghost" onClick={() => router.push('/owner/notifications')} className="mb-6 -ml-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Inbox
        </Button>
        <div className="bg-danger/10 text-danger p-6 rounded-3xl border border-danger/20 text-center">
          <p className="font-semibold mb-2">Notification Not Found</p>
          <p className="text-sm">This notification could not be loaded. It may have been deleted.</p>
        </div>
      </div>
    );
  }

  const notification = notificationData.data;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="ghost" onClick={() => router.push('/owner/notifications')} className="-ml-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Inbox
        </Button>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="text-danger border-danger/30 hover:bg-danger/10"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
           <NotificationDetails notification={notification} />
        </div>
        <div className="lg:col-span-1">
           <NotificationTimeline notification={notification} />
        </div>
      </motion.div>

      <DeleteNotificationDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => {
              setIsDeleteDialogOpen(false);
              router.push('/owner/notifications');
            }
          });
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
