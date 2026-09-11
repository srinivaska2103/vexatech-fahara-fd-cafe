'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { X, Sparkles, Plus, AlertCircle, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABLE_TYPES = [
  '1 Seater',
  '2 Seater',
  '4 Seater',
  '6 Seater',
  '8 Seater',
  'Custom'
];

const LOCATIONS = [
  'Indoor',
  'Outdoor',
  'Rooftop',
  'Private Area',
  'Window',
  'Bar',
  'Garden',
  'Other'
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Maintenance', value: 'MAINTENANCE' }
];

export const TableModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  suggestedNumber = '', 
  allTables = [],
  isLoading = false 
}) => {
  const [tableNumber, setTableNumber] = useState('');
  const [tableType, setTableType] = useState('2 Seater');
  const [seats, setSeats] = useState(2);
  const [isCustomType, setIsCustomType] = useState(false);
  const [location, setLocation] = useState('Indoor');
  const [status, setStatus] = useState('ACTIVE');
  const [isCombinable, setIsCombinable] = useState(false);
  const [description, setDescription] = useState('');
  const [combinedTableIds, setCombinedTableIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (initialData) {
        setTableNumber(initialData.table_number || '');
        const typeStr = initialData.table_type || '2 Seater';
        if (TABLE_TYPES.includes(typeStr) && typeStr !== 'Custom') {
          setTableType(typeStr);
          setIsCustomType(false);
        } else {
          setTableType('Custom');
          setIsCustomType(true);
        }
        setSeats(initialData.capacity || 2);
        setLocation(initialData.location || 'Indoor');
        setStatus(initialData.status || 'ACTIVE');
        setIsCombinable(Boolean(initialData.is_combinable));
        setDescription(initialData.description || '');
        setCombinedTableIds(initialData.combined_table_ids || []);
      } else {
        setTableNumber(suggestedNumber || 'T1');
        setTableType('2 Seater');
        setSeats(2);
        setIsCustomType(false);
        setLocation('Indoor');
        setStatus('ACTIVE');
        setIsCombinable(false);
        setDescription('');
        setCombinedTableIds([]);
      }
    }
  }, [isOpen, initialData, suggestedNumber]);

  const handleTableTypeChange = (type) => {
    setTableType(type);
    if (type === 'Custom') {
      setIsCustomType(true);
    } else {
      setIsCustomType(false);
      const match = type.match(/\d+/);
      if (match) {
        setSeats(parseInt(match[0], 10));
      }
    }
  };

  const toggleCombinedTable = (targetId) => {
    if (combinedTableIds.includes(targetId)) {
      setCombinedTableIds(combinedTableIds.filter(id => id !== targetId));
    } else {
      setCombinedTableIds([...combinedTableIds, targetId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNum = tableNumber.trim();
    if (!cleanNum) {
      setErrorMsg('Table number is required');
      return;
    }

    if (!seats || parseInt(seats, 10) < 1) {
      setErrorMsg('Seats capacity must be at least 1');
      return;
    }

    onSubmit({
      table_number: cleanNum,
      capacity: parseInt(seats, 10),
      table_type: isCustomType ? `Custom (${seats} Seats)` : tableType,
      location,
      status,
      is_combinable: isCombinable,
      description,
      combined_table_ids: isCombinable ? combinedTableIds : []
    });
  };

  if (!isOpen) return null;

  const combinableOptions = allTables.filter(t => t.id !== initialData?.id && t.status === 'ACTIVE');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-[#DDB892]/60 shadow-2xl max-w-lg w-full overflow-hidden text-[#2C1810]"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] p-5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#2C1810]">
                  {initialData ? `Edit Table ${initialData.table_number}` : 'Create New Table'}
                </h3>
                <p className="text-xs text-text/60 font-medium">Configure seating capacity, type and location</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-text/60 hover:text-[#2C1810] flex items-center justify-center border border-border/60 hover:bg-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Table Number & Table Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                  Table Number *
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. T1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-border/60 text-xs font-bold focus:outline-none focus:border-[#6F4E37] bg-surface/30"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                  Table Type
                </label>
                <CustomSelect
                  options={TABLE_TYPES}
                  value={tableType}
                  onChange={(val) => handleTableTypeChange(val)}
                />
              </div>
            </div>

            {/* Seats Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                Seats Count * {isCustomType && <span className="text-[#6F4E37] font-normal">(Custom Size)</span>}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-2xl border border-border/60 text-xs font-bold focus:outline-none focus:border-[#6F4E37] bg-surface/30"
              />
            </div>

            {/* Location & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                  Location
                </label>
                <CustomSelect
                  options={LOCATIONS}
                  value={location}
                  onChange={(val) => setLocation(val)}
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                  Status
                </label>
                <CustomSelect
                  options={STATUS_OPTIONS}
                  value={status}
                  onChange={(val) => setStatus(val)}
                />
              </div>
            </div>

            {/* Allow Combination Toggle */}
            <div className="p-3.5 rounded-2xl bg-surface/40 border border-border/50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#2C1810]">Allow Combination</h4>
                  <p className="text-[11px] text-text/60 font-medium">Enable combining this table with adjacent tables for large parties</p>
                </div>
                <input
                  type="checkbox"
                  checked={isCombinable}
                  onChange={(e) => setIsCombinable(e.target.checked)}
                  className="w-5 h-5 accent-[#6F4E37] rounded-md cursor-pointer"
                />
              </div>

              {isCombinable && combinableOptions.length > 0 && (
                <div className="pt-2 border-t border-border/30 space-y-1.5">
                  <span className="text-[11px] font-extrabold text-[#2C1810] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Can combine with tables:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {combinableOptions.map(t => {
                      const isSelected = combinedTableIds.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleCombinedTable(t.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#6F4E37] text-white shadow-2xs' 
                              : 'bg-white text-text/70 border border-border/60 hover:border-[#6F4E37]'
                          }`}
                        >
                          {t.table_number} ({t.capacity} seats)
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-xs font-extrabold text-[#2C1810] mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Near window with garden view"
                className="w-full px-3.5 py-2 rounded-2xl border border-border/60 text-xs font-medium focus:outline-none focus:border-[#6F4E37] bg-surface/30"
              />
            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-2xl px-5 py-2 text-xs font-bold border-border/60"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl px-6 py-2 text-xs font-extrabold bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white shadow-xs hover:shadow-md"
              >
                {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Table'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
