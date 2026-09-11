'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TableCombinationsModal = ({
  isOpen,
  onClose,
  table,
  allTables = [],
  onSubmit,
  isLoading = false
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen && table) {
      const currentCombined = table.combined_table_ids || (table.combined_with || []).map(c => c.id);
      setSelectedIds(currentCombined);
    }
  }, [isOpen, table]);

  if (!isOpen || !table) return null;

  const availableTables = allTables.filter(t => t.id !== table.id && t.status === 'ACTIVE');

  const toggleSelect = (targetId) => {
    if (selectedIds.includes(targetId)) {
      setSelectedIds(selectedIds.filter(id => id !== targetId));
    } else {
      setSelectedIds([...selectedIds, targetId]);
    }
  };

  const handleSave = () => {
    onSubmit({
      tableId: table.id,
      combinedTableIds: selectedIds
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-[#DDB892]/60 shadow-2xl max-w-md w-full overflow-hidden text-[#2C1810]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] p-5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#2C1810]">
                  Configure Combinations for {table.table_number}
                </h3>
                <p className="text-xs text-text/60 font-medium">Select tables that can be joined with Table {table.table_number}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-text/60 hover:text-[#2C1810] flex items-center justify-center border border-border/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-900 text-xs font-semibold leading-relaxed">
              When a large guest party books, Fahara backend can automatically pair Table {table.table_number} ({table.capacity} seats) with selected tables.
            </div>

            {availableTables.length === 0 ? (
              <div className="text-center py-6 text-xs text-text/50">
                No other active tables available for combination.
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#2C1810]">
                  Select Combinable Tables ({selectedIds.length} selected)
                </label>

                <div className="space-y-2">
                  {availableTables.map((t) => {
                    const isSelected = selectedIds.includes(t.id);
                    const combinedCapacity = table.capacity + t.capacity;

                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleSelect(t.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#6F4E37]/10 border-[#6F4E37] text-[#2C1810]'
                            : 'bg-white border-border/60 hover:border-[#6F4E37]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#6F4E37] rounded cursor-pointer"
                          />
                          <div>
                            <h4 className="text-xs font-extrabold text-[#2C1810]">Table {t.table_number}</h4>
                            <p className="text-[11px] text-text/60 font-medium">
                              {t.capacity} Seats • {t.location || 'Indoor'}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-black text-[#6F4E37] bg-white px-2.5 py-1 rounded-xl border border-border/40">
                          Total {combinedCapacity} Seats
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/40 flex items-center justify-end gap-3 bg-surface/30">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-2xl px-4 py-2 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-2xl px-5 py-2 text-xs font-extrabold bg-[#6F4E37] text-white shadow-xs"
            >
              {isLoading ? 'Saving...' : 'Save Combination Rule'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
