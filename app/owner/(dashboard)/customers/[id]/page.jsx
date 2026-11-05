'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useCustomer, 
  useCustomerBookings, 
  useCustomerFoodOrders,
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
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const confirm = useConfirm();

  const userRole = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  // Queries
  const { data: customerData, isLoading: loadingCustomer, isError: customerError } = useCustomer(id);
  const { data: bookingsData } = useCustomerBookings(id);
  const { data: foodOrdersData } = useCustomerFoodOrders(id);
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
         <div className="h-10 w-32 bg-stone-100 rounded-lg mb-4" />
         <div className="h-40 w-full bg-stone-100 rounded-3xl" />
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           <div className="xl:col-span-2 space-y-6">
             <div className="h-32 bg-stone-100 rounded-3xl" />
             <div className="h-96 bg-stone-100 rounded-3xl" />
           </div>
           <div className="h-full bg-stone-100 rounded-3xl" />
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
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-stone-800">Customer Not Found</h2>
          <p className="text-stone-500 max-w-sm mx-auto text-sm">
            The customer you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => router.push('/owner/customers')}>
            Return to List
          </Button>
        </div>
      </div>
    );
  }

  const customer = customerData.data;
  const bookings = bookingsData?.data || [];
  const foodOrders = foodOrdersData?.data || [];
  const payments = paymentsData?.data || [];
  const reviews = reviewsData?.data || [];
  const notes = customer.notes || [];

  // Handlers
  const handleToggleVip = () => {
    toggleVipMutation.mutate({ customerId: id, currentStatus: customer.is_vip });
  };

  const handleBlockCustomer = (reason) => {
    blockMutation.mutate({ customerId: id, reason }, {
      onSuccess: () => setIsBlockDialogOpen(false)
    });
  };

  const handleUnblockCustomer = async () => {
    const isConfirmed = await confirm({
      title: 'Unblock Customer',
      message: `Are you sure you want to unblock ${customer.name}? They will be able to make bookings and orders again.`,
      confirmText: 'Unblock',
      variant: 'default'
    });

    if (isConfirmed) {
      unblockMutation.mutate(id);
    }
  };

  const handleAddNote = (noteText) => {
    addNoteMutation.mutate({ customerId: id, data: { note: noteText } }, {
      onSuccess: () => setIsNoteDialogOpen(false)
    });
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsNoteDialogOpen(true);
  };

  const handleUpdateNote = (noteText) => {
    if (!editingNote) return;
    updateNoteMutation.mutate({ customerId: id, noteId: editingNote.id, data: { note: noteText } }, {
      onSuccess: () => {
        setIsNoteDialogOpen(false);
        setEditingNote(null);
      }
    });
  };

  const handleDeleteNote = async (noteId) => {
    const isConfirmed = await confirm({
      title: 'Delete Note',
      message: 'Are you sure you want to delete this internal staff note?',
      confirmText: 'Delete',
      variant: 'destructive'
    });

    if (isConfirmed) {
      deleteNoteMutation.mutate({ customerId: id, noteId });
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/owner/customers')} 
        className="mb-2 -ml-3 text-stone-600 hover:text-[#E50914] font-bold text-xs"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Customers
      </Button>

      <CustomerProfile 
        customer={customer}
        bookings={bookings}
        foodOrders={foodOrders}
        payments={payments}
        reviews={reviews}
        notes={notes}
        handlers={{
          onToggleVip: handleToggleVip,
          isTogglingVip: toggleVipMutation.isPending,
          onBlock: () => setIsBlockDialogOpen(true),
          onUnblock: handleUnblockCustomer,
          onAddNote: () => {
            setEditingNote(null);
            setIsNoteDialogOpen(true);
          },
          onEditNote: handleEditNote,
          onDeleteNote: handleDeleteNote
        }}
      />

      {/* Dialogs */}
      <AddNoteDialog 
        isOpen={isNoteDialogOpen}
        onClose={() => {
          setIsNoteDialogOpen(false);
          setEditingNote(null);
        }}
        onSubmit={editingNote ? handleUpdateNote : handleAddNote}
        initialText={editingNote?.note || ''}
        isEditing={!!editingNote}
        isLoading={addNoteMutation.isPending || updateNoteMutation.isPending}
      />

      <BlockCustomerDialog 
        isOpen={isBlockDialogOpen}
        onClose={() => setIsBlockDialogOpen(false)}
        onConfirm={handleBlockCustomer}
        customerName={customer.name}
        isLoading={blockMutation.isPending}
      />
    </div>
  );
}
