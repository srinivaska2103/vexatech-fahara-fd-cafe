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
  handlers,
  isWalkingCafe = false
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header Section */}
      <CustomerHeader 
        customer={customer} 
        onToggleVip={handlers.onToggleVip} 
        onBlock={handlers.onBlock}
        isTogglingVip={handlers.isTogglingVip}
      />

      {/* Stats & Notes Grid */}
      <div className={`grid grid-cols-1 ${isWalkingCafe ? 'xl:grid-cols-1' : 'xl:grid-cols-3'} gap-4 sm:gap-6`}>
        <div className={`${isWalkingCafe ? 'xl:col-span-1' : 'xl:col-span-2'} space-y-4 sm:space-y-6`}>
          <CustomerStats customer={customer} isWalkingCafe={isWalkingCafe} />
          
          {/* Main Content Tabs */}
          <div className="bg-white p-3.5 sm:p-6 rounded-3xl border border-border shadow-xs min-h-[350px]">
             <Tabs defaultValue={isWalkingCafe ? "reviews" : "bookings"} className="w-full">
                <TabsList className="mb-4 sm:mb-6 overflow-x-auto custom-scrollbar flex max-w-full">
                  {!isWalkingCafe && <TabsTrigger value="bookings">Booking History</TabsTrigger>}
                  {!isWalkingCafe && <TabsTrigger value="payments">Payments</TabsTrigger>}
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                {!isWalkingCafe && (
                  <TabsContent value="bookings">
                    <CustomerBookings bookings={bookings} />
                  </TabsContent>
                )}
                
                {!isWalkingCafe && (
                  <TabsContent value="payments">
                    <CustomerPayments payments={payments} />
                  </TabsContent>
                )}
                
                <TabsContent value="reviews">
                  <CustomerReviews reviews={reviews} />
                </TabsContent>
             </Tabs>
          </div>
        </div>
        
        {/* Right Sidebar - Notes (Hidden for Walking Cafes) */}
        {!isWalkingCafe && (
          <div className="xl:col-span-1 h-full">
             <CustomerNotes 
               notes={notes}
               onAddNote={handlers.onAddNote}
               onEditNote={handlers.onEditNote}
               onDeleteNote={handlers.onDeleteNote}
             />
          </div>
        )}
      </div>
    </div>
  );
};
