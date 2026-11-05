import React from 'react';
import { CustomerHeader } from './CustomerHeader';
import { CustomerStats } from './CustomerStats';
import { CustomerNotes } from './CustomerNotes';
import { CustomerBookings } from './CustomerBookings';
import { CustomerPayments } from './CustomerPayments';
import { CustomerReviews } from './CustomerReviews';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { ShoppingBag, Utensils, Receipt, Star, Clock, Calendar } from 'lucide-react';

export const CustomerProfile = ({ 
  customer, 
  bookings = [], 
  foodOrders = [],
  payments = [], 
  reviews = [], 
  notes = [],
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          <CustomerStats customer={customer} isWalkingCafe={isWalkingCafe} />
          
          {/* Main Content Tabs */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#FEE2E2] shadow-xs min-h-[350px]">
             <Tabs defaultValue={foodOrders.length > 0 ? "orders" : "bookings"} className="w-full">
                <TabsList className="mb-4 sm:mb-6 overflow-x-auto custom-scrollbar flex max-w-full gap-2">
                  <TabsTrigger value="orders" className="flex items-center gap-1.5 font-bold">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Food Orders ({foodOrders.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="flex items-center gap-1.5 font-bold">
                    <Utensils className="w-3.5 h-3.5 text-stone-600" />
                    <span>Bookings ({bookings.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="flex items-center gap-1.5 font-bold">
                    <Receipt className="w-3.5 h-3.5 text-stone-600" />
                    <span>Payments ({payments.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-1.5 font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Reviews ({reviews.length})</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* 1. Food Orders History */}
                <TabsContent value="orders">
                  {foodOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400 font-bold">
                      No food orders recorded for this customer yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {foodOrders.map(order => (
                        <div key={order.id} className="p-4 rounded-2xl bg-[#FFF5F5]/60 border border-[#FEE2E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-xs text-[#252525]">#{order.order_number}</span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-[#FEE2E2] text-[#E50914] uppercase">
                                {order.order_type}
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                order.order_status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-700'
                              }`}>
                                {order.order_status}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-500 font-medium mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-[#E50914]" />
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span>•</span>
                              <span>{order.food_order_items?.length || 0} items</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black text-[#E50914]">
                              ₹{Number(order.total_amount || 0).toFixed(2)}
                            </span>
                            <div className="text-[10px] font-black text-emerald-700">
                              {order.payment_status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* 2. Bookings History */}
                <TabsContent value="bookings">
                  <CustomerBookings bookings={bookings} />
                </TabsContent>
                
                {/* 3. Payments */}
                <TabsContent value="payments">
                  <CustomerPayments payments={payments} />
                </TabsContent>
                
                {/* 4. Reviews */}
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
