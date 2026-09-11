'use client';
import React, { useState, useEffect } from 'react';
import { useCafes } from '@/hooks/cafe';
import { 
  useTables, 
  useNextTableNumber, 
  useCreateTable, 
  useUpdateTable, 
  useUpdateTableStatus, 
  useDeleteTable,
  useSaveTableCombinations
} from '@/hooks/table';
import { useAuthStore } from '@/store/auth.store';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { CapacitySummaryCard } from '@/components/tables/CapacitySummaryCard';
import { TableCard } from '@/components/tables/TableCard';
import { TableModal } from '@/components/tables/TableModal';
import { TableLayoutView } from '@/components/tables/TableLayoutView';
import { TableCombinationsModal } from '@/components/tables/TableCombinationsModal';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Armchair, 
  CheckCircle2, 
  AlertCircle, 
  Grid, 
  List, 
  Sparkles,
  Link as LinkIcon,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TableManagementPage() {
  const user = useAuthStore((state) => state.user);
  const confirm = useConfirm();

  const [selectedCafeId, setSelectedCafeId] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'layout'
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboTableTarget, setComboTableTarget] = useState(null);

  // Fetch Cafes owned by user
  const { data: cafesData, isLoading: isCafesLoading } = useCafes(
    { owner_id: user?.id },
    { enabled: !!user?.id }
  );

  const cafes = Array.isArray(cafesData) ? cafesData : (cafesData?.data || cafesData?.cafes || []);

  useEffect(() => {
    if (cafes.length > 0 && !selectedCafeId) {
      setSelectedCafeId(cafes[0].id);
    }
  }, [cafes, selectedCafeId]);

  // Fetch Tables & Capacity Summary for selected cafe
  const { 
    data: tablesData, 
    isLoading: isTablesLoading, 
    isError,
    refetch 
  } = useTables(selectedCafeId, { enabled: !!selectedCafeId });

  const { data: nextNumData } = useNextTableNumber(selectedCafeId, { enabled: !!selectedCafeId });
  const suggestedNumber = nextNumData?.data?.suggested_number || 'T1';

  const tablePayload = tablesData?.data || tablesData || {};
  const capacitySummary = tablePayload.capacity_summary || {
    total_cafe_capacity: 0,
    assigned_table_capacity: 0,
    unassigned_capacity: 0
  };
  const tables = tablePayload.tables || [];

  // Mutations
  const createMutation = useCreateTable(selectedCafeId);
  const updateMutation = useUpdateTable(selectedCafeId);
  const statusMutation = useUpdateTableStatus(selectedCafeId);
  const deleteMutation = useDeleteTable(selectedCafeId);
  const comboMutation = useSaveTableCombinations(selectedCafeId);

  // Filter Tables
  const filteredTables = tables.filter(t => {
    const matchesSearch = !search || 
      t.table_number.toLowerCase().includes(search.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(search.toLowerCase())) ||
      (t.table_type && t.table_type.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesLocation = selectedLocation === 'ALL' || (t.location || 'Indoor').toUpperCase() === selectedLocation.toUpperCase();

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleOpenCreateModal = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingTable) {
      updateMutation.mutate({ tableId: editingTable.id, data }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleToggleStatus = async (table) => {
    const newStatus = table.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const isConfirmed = await confirm({
      title: `${newStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} Table ${table.table_number}?`,
      message: newStatus === 'INACTIVE'
        ? `Customers will no longer be able to book Table ${table.table_number} while it is inactive.`
        : `Table ${table.table_number} will become available for customer reservations.`,
      confirmText: newStatus === 'ACTIVE' ? 'Activate Table' : 'Deactivate Table',
      cancelText: 'Cancel',
      type: newStatus === 'INACTIVE' ? 'warning' : 'info'
    });

    if (isConfirmed) {
      statusMutation.mutate({ tableId: table.id, status: newStatus });
    }
  };

  const handleDeleteTable = async (table) => {
    const isConfirmed = await confirm({
      title: `Delete or Deactivate Table ${table.table_number}?`,
      message: `Are you sure you want to remove Table ${table.table_number}? If this table has booking history, it will be deactivated to preserve historical records.`,
      confirmText: 'Delete / Deactivate Table',
      cancelText: 'Keep Table',
      type: 'danger'
    });

    if (isConfirmed) {
      deleteMutation.mutate(table.id);
    }
  };

  const handleManageCombinations = (table) => {
    setComboTableTarget(table);
    setIsComboModalOpen(true);
  };

  const handleSaveCombinations = ({ tableId, combinedTableIds }) => {
    comboMutation.mutate({ tableId, combinedTableIds }, {
      onSuccess: () => setIsComboModalOpen(false)
    });
  };

  const locationsList = ['ALL', ...Array.from(new Set(tables.map(t => t.location || 'Indoor')))];

  if (isCafesLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="card" className="h-[200px] rounded-3xl" />
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <EmptyState
          icon={Store}
          title="No Cafe Venues Registered"
          message="Please add a cafe venue first before managing physical table arrangements."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Top Header Banner with Cafe Selector */}
      <div className="bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] p-6 rounded-3xl border border-[#DDB892]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] text-white flex items-center justify-center font-extrabold shadow-xs shrink-0">
            <Armchair className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">Table Management</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                SEATING CONFIG
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text/70 mt-0.5">
              Manage your cafe seating, table capacity and availability.
            </p>
          </div>
        </div>

        {/* Cafe Selector & Add Table Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Cafe Custom Select */}
          <div className="w-full sm:w-60">
            <CustomSelect
              options={cafes.map(c => ({
                label: `☕ ${c.name} (Max ${c.maximum_persons || 0})`,
                value: c.id
              }))}
              value={selectedCafeId}
              onChange={(val) => setSelectedCafeId(val)}
            />
          </div>

          <Button
            onClick={handleOpenCreateModal}
            className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-xs hover:shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </Button>
        </div>
      </div>

      {/* Capacity Summary Section */}
      {isTablesLoading ? (
        <LoadingSkeleton type="card" className="h-[140px] rounded-3xl" />
      ) : (
        <CapacitySummaryCard capacitySummary={capacitySummary} />
      )}

      {/* Filter & View Mode Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-border/60 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {['ALL', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[#6F4E37] text-white shadow-2xs'
                  : 'bg-surface/60 text-text/65 hover:bg-surface hover:text-[#2C1810]'
              }`}
            >
              {st === 'ALL' ? 'All Tables' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search & Layout View Toggles */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-border/60 bg-surface/30 focus:outline-none focus:bg-white focus:border-[#6F4E37] transition-all font-medium"
              placeholder="Search table number or location..."
            />
          </div>

          <div className="flex bg-surface p-1 rounded-xl border border-border/40 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-[#6F4E37]' : 'text-text/50 hover:text-[#2C1810]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isTablesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} type="card" className="h-[180px] rounded-3xl" />)}
        </div>
      ) : isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load tables"
          message="There was an error retrieving physical tables for this cafe."
          action={
            <Button onClick={() => refetch()} className="bg-[#6F4E37] text-white font-extrabold rounded-2xl px-5 py-2">
              Try Again
            </Button>
          }
        />
      ) : filteredTables.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title={search ? "No tables match your filter" : "No tables added yet"}
          message={search ? "Try searching for a different table number or status." : "Create your first table to start managing cafe seating and guest reservations."}
          action={!search && (
            <Button onClick={handleOpenCreateModal} className="bg-[#6F4E37] text-white font-extrabold rounded-2xl px-6 py-2.5 shadow-xs">
              <Plus className="w-4 h-4 mr-1.5" /> + Add Table
            </Button>
          )}
        />
      ) : viewMode === 'layout' ? (
        <TableLayoutView 
          tables={filteredTables} 
          cafeId={selectedCafeId}
          onSelectTable={handleOpenEditModal} 
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                onEdit={handleOpenEditModal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTable}
                onManageCombinations={handleManageCombinations}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Table Modal */}
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTable}
        suggestedNumber={suggestedNumber}
        allTables={tables}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Table Combinations Modal */}
      <TableCombinationsModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        table={comboTableTarget}
        allTables={tables}
        onSubmit={handleSaveCombinations}
        isLoading={comboMutation.isPending}
      />

    </div>
  );
}
