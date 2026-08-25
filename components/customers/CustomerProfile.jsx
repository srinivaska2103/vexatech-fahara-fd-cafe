import React from 'react';
import { CustomerHeader } from './CustomerHeader';
import { CustomerStats } from './CustomerStats';
import { CustomerNotes } from './CustomerNotes';
import { CustomerBookings } from './CustomerBookings';
import { CustomerPayments } from './CustomerPayments';
import { CustomerReviews } from './CustomerReviews';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';

export const CustomerProfile = ({ 
  customer, 
  bookings, 
  payments, 
  reviews, 
  notes,
  handlers 
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <CustomerHeader 
        customer={customer} 
        onToggleVip={handlers.onToggleVip} 
        onBlock={handlers.onBlock}
        isTogglingVip={handlers.isTogglingVip}
      />

      {/* Stats & Notes Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <CustomerStats customer={customer} />
          
          {/* Main Content Tabs */}
          <div className="bg-white p-6 rounded-3xl border border-border shadow-sm min-h-[400px]">
             <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="bookings">Booking History</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bookings">
                  <CustomerBookings bookings={bookings} />
                </TabsContent>
                
                <TabsContent value="payments">
                  <CustomerPayments payments={payments} />
                </TabsContent>
                
                <TabsContent value="reviews">
                  <CustomerReviews reviews={reviews} />
                </TabsContent>
             </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar - Notes */}
        <div className="xl:col-span-1 h-full">
           <CustomerNotes 
             notes={notes}
             onAddNote={handlers.onAddNote}
             onEditNote={handlers.onEditNote}
             onDeleteNote={handlers.onDeleteNote}
           />
        </div>
      </div>
    </div>
  );
};
