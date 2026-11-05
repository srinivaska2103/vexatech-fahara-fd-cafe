'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bike, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Phone, 
  User, 
  Shield, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { foodOrderService } from '@/services/foodOrder.service';
import ModernDropdown from '@/components/ui/ModernDropdown';
import { toast } from 'react-hot-toast';

export default function DeliveryStaffPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('BIKE');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loginPin, setLoginPin] = useState('1234');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['cafe-delivery-staff'],
    queryFn: () => foodOrderService.getDeliveryEmployees()
  });

  const staffList = data?.data || [];

  const openCreateModal = () => {
    setEditingStaff(null);
    setName('');
    setEmployeeCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setPhone('');
    setVehicleType('BIKE');
    setVehicleNumber('');
    setLoginPin('1234');
    setModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setName(staff.name);
    setEmployeeCode(staff.employee_code);
    setPhone(staff.phone);
    setVehicleType(staff.vehicle_type);
    setVehicleNumber(staff.vehicle_number || '');
    setLoginPin(staff.login_pin || '1234');
    setModalOpen(true);
  };

  // Create / Update Staff Mutation
  const saveMutation = useMutation({
    mutationFn: (payload) => {
      if (editingStaff) {
        return foodOrderService.updateDeliveryEmployee(editingStaff.id, payload);
      }
      return foodOrderService.createDeliveryEmployee(payload);
    },
    onSuccess: () => {
      toast.success(editingStaff ? 'Staff member updated' : 'Delivery staff member added');
      queryClient.invalidateQueries({ queryKey: ['cafe-delivery-staff'] });
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save staff member');
    }
  });

  // Toggle active status
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => foodOrderService.toggleEmployeeStatus(id, { isActive }),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['cafe-delivery-staff'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error('Staff name and contact phone are required');
      return;
    }
    saveMutation.mutate({
      name,
      employeeCode,
      phone,
      vehicleType,
      vehicleNumber,
      loginPin
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FEE2E2] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FFF5F5] text-[#E50914] border border-[#FEE2E2]">
              <Bike className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
              Restaurant Delivery Staff
            </h1>
          </div>
          <p className="text-xs text-[#757575] mt-1">
            Manage your in-house delivery drivers, assigned vehicles and availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/delivery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black rounded-xl cursor-pointer transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Launch Driver Portal
          </a>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#B71C1C] text-xs font-black text-white rounded-xl cursor-pointer shadow-md shadow-[#E50914]/20 transition-all w-fit"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Delivery Driver
          </button>
        </div>
      </div>

      {/* ── STAFF LIST ── */}
      {isLoading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-6 h-6 text-[#E50914] animate-spin mx-auto mb-2" />
          <span className="text-xs text-[#757575] font-bold">Loading delivery personnel...</span>
        </div>
      ) : staffList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-[#FEE2E2] p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF5F5] text-[#E50914] flex items-center justify-center mx-auto border border-[#FEE2E2]">
            <Bike className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-[#252525]">No Delivery Drivers Registered</h3>
          <p className="text-xs text-[#757575] max-w-sm mx-auto">
            Add your internal delivery employees so you can dispatch orders directly to them.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#E50914] text-white text-xs font-black rounded-xl cursor-pointer"
          >
            Add First Driver
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((driver) => (
            <div
              key={driver.id}
              className="bg-white rounded-3xl border border-[#FEE2E2] p-5 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-sm border border-purple-200">
                    {driver.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#252525]">{driver.name}</h4>
                    <span className="text-[10px] text-[#757575] font-bold uppercase tracking-wider block">
                      Code: {driver.employee_code}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMutation.mutate({ id: driver.id, isActive: !driver.is_active })}
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-colors ${
                    driver.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {driver.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="bg-[#FFF5F5] rounded-2xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px] font-bold text-[#252525]">
                  <span className="text-[#757575] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#E50914]" /> Phone
                  </span>
                  <span>{driver.phone}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#252525]">
                  <span className="text-[#757575] flex items-center gap-1">
                    <Bike className="w-3 h-3 text-[#E50914]" /> Vehicle
                  </span>
                  <span>{driver.vehicle_type} ({driver.vehicle_number || 'N/A'})</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#252525]">
                  <span className="text-[#757575] flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#E50914]" /> Portal PIN
                  </span>
                  <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#FEE2E2]">{driver.login_pin || '1234'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#FEE2E2] flex items-center justify-between">
                <span className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase ${
                  driver.availability_status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700' :
                  driver.availability_status === 'ON_DELIVERY' ? 'bg-amber-50 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  Status: {driver.availability_status.replace(/_/g, ' ')}
                </span>

                <button
                  onClick={() => openEditModal(driver)}
                  className="p-1.5 rounded-xl border border-[#FEE2E2] hover:bg-[#FFF5F5] text-xs font-bold text-[#252525] flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#E50914]" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#FEE2E2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#FEE2E2] pb-3">
              <div className="flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#E50914]" />
                <h3 className="text-base font-black text-[#252525]">
                  {editingStaff ? 'Edit Delivery Staff' : 'Add Delivery Staff'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-xl text-[#757575] hover:bg-[#FFF5F5]">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Vehicle Type
                  </label>
                  <ModernDropdown
                    className="w-full"
                    value={vehicleType}
                    onChange={setVehicleType}
                    options={[
                      { value: 'BIKE', label: 'Motorcycle / Bike' },
                      { value: 'SCOOTER', label: 'Scooter' },
                      { value: 'BICYCLE', label: 'Bicycle' },
                      { value: 'CAR', label: 'Car' }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    placeholder="e.g. KA-01-AB-1234"
                    className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-bold text-[#252525] outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#252525] uppercase tracking-wider block mb-1">
                  Portal Login PIN (4 Digits) *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2 bg-white border border-[#FEE2E2] rounded-xl text-xs font-mono font-bold text-[#252525] outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#FEE2E2]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#FEE2E2] text-xs font-bold text-[#757575] hover:bg-[#FFF5F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#B71C1C] text-xs font-black text-white cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'Saving...' : editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

