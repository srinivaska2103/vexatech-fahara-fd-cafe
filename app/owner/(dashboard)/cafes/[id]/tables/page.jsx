'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCafe } from '@/hooks/cafe';
import { 
  useTables, 
  useNextTableNumber, 
  useCreateTable, 
  useUpdateTable, 
  useUpdateTableStatus, 
  useDeleteTable,
  useSaveTableCombinations
} from '@/hooks/table';
import { useConfirm } from '@/components/ui/ConfirmModal';
import { CapacitySummaryCard } from '@/components/tables/CapacitySummaryCard';
import { TableCard } from '@/components/tables/TableCard';
import { TableModal } from '@/components/tables/TableModal';
import { TableLayoutView } from '@/components/tables/TableLayoutView';
import { TableCombinationsModal } from '@/components/tables/TableCombinationsModal';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { BackButton } from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { 
  Plus, 
  Search, 
  Grid, 
  List as ListIcon, 
  Store, 
  Armchair, 
  AlertTriangle 
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function CafeSpecificTablesPage() {
  const params = useParams();
  const cafeId = params?.id;
  const confirm = useConfirm();

  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboTableTarget, setComboTableTarget] = useState(null);

  const { data: cafeData, isLoading: isCafeLoading } = useCafe(cafeId);
  const cafe = cafeData?.data || cafeData;

  const { data: tablesData, isLoading: isTablesLoading, refetch } = useTables(cafeId, { enabled: !!cafeId });
  const { data: nextNumData } = useNextTableNumber(cafeId, { enabled: !!cafeId });

  const suggestedNumber = nextNumData?.data?.suggested_number || 'T1';
  const tablePayload = tablesData?.data || tablesData || {};
  const capacitySummary = tablePayload.capacity_summary || {
    total_cafe_capacity: cafe?.maximum_persons || 0,
    assigned_table_capacity: 0,
    unassigned_capacity: cafe?.maximum_persons || 0
  };
  const tables = tablePayload.tables || [];

  const createMutation = useCreateTable(cafeId);
  const updateMutation = useUpdateTable(cafeId);
  const statusMutation = useUpdateTableStatus(cafeId);
  const deleteMutation = useDeleteTable(cafeId);
  const comboMutation = useSaveTableCombinations(cafeId);

  const filteredTables = tables.filter(t => {
    const matchesSearch = !search || 
      t.table_number.toLowerCase().includes(search.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
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

  if (isCafeLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <LoadingSkeleton type="card" className="h-[200px] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-[#2C1810]">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton href={`/owner/cafes/${cafeId}`} label="Back to Cafe" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#2C1810] tracking-tight">{cafe?.name || 'Cafe'} Tables</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37] text-[10px] font-extrabold">
                TABLE MANAGEMENT
              </span>
            </div>
            <p className="text-xs text-text/60">Configure physical tables, seating capacity and combinations for {cafe?.name}</p>
          </div>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white font-extrabold text-xs shadow-xs hover:shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </Button>
      </div>

      {/* Capacity Summary */}
      {isTablesLoading ? (
        <LoadingSkeleton type="card" className="h-[140px] rounded-3xl" />
      ) : (
        <CapacitySummaryCard capacitySummary={capacitySummary} />
      )}

      {/* Toolbar */}
      <div className="bg-white p-3 sm:p-4 rounded-3xl border border-border/60 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-3">
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

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F4E37]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-border/60 bg-surface/30 focus:outline-none focus:bg-white focus:border-[#6F4E37] transition-all font-medium"
              placeholder="Search table number..."
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

      {/* Main Grid or Layout */}
      {isTablesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} type="card" className="h-[180px] rounded-3xl" />)}
        </div>
      ) : filteredTables.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title={search ? "No tables match your filter" : "No tables added yet"}
          message={search ? "Try adjusting search query." : "Create your first table for this cafe to start managing guest seating."}
          action={!search && (
            <Button onClick={handleOpenCreateModal} className="bg-[#6F4E37] text-white font-extrabold rounded-2xl px-6 py-2.5 shadow-xs">
              <Plus className="w-4 h-4 mr-1.5" /> + Add Table
            </Button>
          )}
        />
      ) : viewMode === 'layout' ? (
        <TableLayoutView 
          tables={filteredTables} 
          cafeId={cafeId}
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

      {/* Modals */}
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTable}
        suggestedNumber={suggestedNumber}
        allTables={tables}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

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
