'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useCustomer, 
  useCustomerBookings, 
  useCustomerPayments, 
  useCustomerReviews,
  useAddCustomerNote,
  useUpdateCustomerNote,
  useDeleteCustomerNote,
  useToggleVIP,
  useBlockCustomer,
  useUnblockCustomer
} from '@/hooks/customer';
import { CustomerProfile } from '@/components/customers/CustomerProfile';
import { AddNoteDialog } from '@/components/customers/AddNoteDialog';
import { BlockCustomerDialog } from '@/components/customers/BlockCustomerDialog';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const confirm = useConfirm();


  // Queries
  const { data: customerData, isLoading: loadingCustomer, isError: customerError } = useCustomer(id);
  const { data: bookingsData } = useCustomerBookings(id);
  const { data: paymentsData } = useCustomerPayments(id);
  const { data: reviewsData } = useCustomerReviews(id);

  // Mutations
  const addNoteMutation = useAddCustomerNote();
  const updateNoteMutation = useUpdateCustomerNote();
  const deleteNoteMutation = useDeleteCustomerNote();
  const toggleVipMutation = useToggleVIP();
  const blockMutation = useBlockCustomer();
  const unblockMutation = useUnblockCustomer();

  // UI State
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  if (loadingCustomer) {
    return (
      <div className="p-6 md:p-8 animate-pulse space-y-6">
         <div className="h-10 w-32 bg-surface rounded-lg mb-4" />
         <div className="h-40 w-full bg-surface rounded-3xl" />
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <div className="xl:col-span-2 space-y-6">
             <div className="h-32 bg-surface rounded-3xl" />
             <div className="h-96 bg-surface rounded-3xl" />
           </div>
           <div className="h-full bg-surface rounded-3xl" />
         </div>
      </div>
    );
  }

  if (customerError || !customerData?.data) {
    return (
      <div className="p-6 md:p-8">
        <Button variant="ghost" onClick={() => router.push('/owner/customers')} className="mb-6 -ml-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Customers
        </Button>
        <div className="bg-danger/10 text-danger p-6 rounded-3xl border border-danger/20 text-center">
          <p className="font-semibold mb-2">Customer Not Found</p>
          <p className="text-sm">This customer profile could not be loaded or the endpoint is not implemented.</p>
        </div>
      </div>
    );
  }

  const customer = customerData.data;
  // Assuming backend returns notes within the customer object or as a separate endpoint. We'll extract from customer.
  const notes = customer.notes || []; 

  const handleToggleVip = (isVip) => {
    toggleVipMutation.mutate({ customerId: id, isVip: customer.is_vip });
  };

  const handleBlockAction = () => {
    if (customer.status === 'BLOCKED') {
      unblockMutation.mutate(id);
    } else {
      setIsBlockDialogOpen(true);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <Button variant="ghost" onClick={() => router.push('/owner/customers')} className="mb-2 -ml-4">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Customers
      </Button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <CustomerProfile 
          customer={customer}
          bookings={bookingsData?.data || []}
          payments={paymentsData?.data || []}
          reviews={reviewsData?.data || []}
          notes={notes}
          handlers={{
            onToggleVip: handleToggleVip,
            isTogglingVip: toggleVipMutation.isPending,
            onBlock: handleBlockAction,
            onAddNote: () => { setEditingNote(null); setIsNoteDialogOpen(true); },
            onEditNote: (note) => { setEditingNote(note); setIsNoteDialogOpen(true); },
            onDeleteNote: async (noteId) => {
              const ok = await confirm({
                title: 'Delete Note',
                message: 'Are you sure you want to delete this customer note?',
                confirmText: 'Delete Note',
                cancelText: 'Keep Note',
                type: 'danger'
              });
              if (ok) {
                deleteNoteMutation.mutate({ customerId: id, noteId });
              }
            }

          }}
        />
      </motion.div>

      <AddNoteDialog 
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        onConfirm={(data) => {
          if (editingNote) {
            updateNoteMutation.mutate({ customerId: id, noteId: editingNote.id, data }, {
              onSuccess: () => setIsNoteDialogOpen(false)
            });
          } else {
            addNoteMutation.mutate({ customerId: id, data }, {
              onSuccess: () => setIsNoteDialogOpen(false)
            });
          }
        }}
        isSubmitting={addNoteMutation.isPending || updateNoteMutation.isPending}
      />

      <BlockCustomerDialog 
        isOpen={isBlockDialogOpen}
        onClose={() => setIsBlockDialogOpen(false)}
        onConfirm={(data) => {
          blockMutation.mutate({ customerId: id, data }, {
            onSuccess: () => setIsBlockDialogOpen(false)
          });
        }}
        isSubmitting={blockMutation.isPending}
      />
    </div>
  );
}
