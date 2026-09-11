'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  RotateCw, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Edit2, 
  Power, 
  Layers, 
  Users, 
  Sparkles,
  Link as LinkIcon,
  Armchair,
  MapPin,
  Grid,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useUpdateTable } from '@/hooks/table';
import toast from 'react-hot-toast';

export const TableLayoutView = ({ tables = [], cafeId, onSelectTable, onToggleStatus }) => {
  const [is3DMode, setIs3DMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLocationFilter, setActiveLocationFilter] = useState('ALL');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [showGridLines, setShowGridLines] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 180, y: 200 });
  
  // Local positions & rotations
  const [positions, setPositions] = useState({});
  const [rotations, setRotations] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateTableMutation = useUpdateTable(cafeId);
  const canvasRef = useRef(null);

  // Set mobile default zoom level on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setZoomLevel(0.75);
    }
  }, []);

  useEffect(() => {
    const posMap = {};
    const rotMap = {};
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    // Check if initial positions are unset (0) or invalid
    let hasUnsetPos = false;
    tables.forEach(t => {
      if (!t.position_x || !t.position_y) hasUnsetPos = true;
    });

    const itemsPerRow = isMobile ? 1 : 3;
    const spacingX = isMobile ? 0 : 220;
    const spacingY = 220;
    const startX = isMobile ? 40 : 70;
    const startY = isMobile ? 40 : 60;

    tables.forEach((t, idx) => {
      const posX = t.position_x || 0;
      const posY = t.position_y || 0;

      if (hasUnsetPos || posX < 20 || posY < 20) {
        const col = idx % itemsPerRow;
        const row = Math.floor(idx / itemsPerRow);
        posMap[t.id] = { x: startX + col * spacingX, y: startY + row * spacingY };
      } else {
        posMap[t.id] = { x: posX, y: posY };
      }
      rotMap[t.id] = t.rotation || 0;
    });

    setPositions(posMap);
    setRotations(rotMap);
    setHasUnsavedChanges(hasUnsetPos);
  }, [tables]);

  const locations = ['ALL', ...Array.from(new Set(tables.map(t => t.location || 'Indoor')))];

  const filteredTables = tables.filter(t => 
    activeLocationFilter === 'ALL' || (t.location || 'Indoor').toUpperCase() === activeLocationFilter.toUpperCase()
  );

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDragEnd = (tableId, info) => {
    const currentPos = positions[tableId] || { x: 40, y: 40 };
    let newX = currentPos.x + Math.round(info.offset.x / zoomLevel);
    let newY = currentPos.y + Math.round(info.offset.y / zoomLevel);

    // Snap to 20px grid alignment
    newX = Math.round(newX / 20) * 20;
    newY = Math.round(newY / 20) * 20;

    // Enforce safety boundary margins for mobile & desktop
    newX = Math.max(30, newX);
    newY = Math.max(30, newY);

    setPositions(prev => ({
      ...prev,
      [tableId]: { x: newX, y: newY }
    }));
    setHasUnsavedChanges(true);
  };

  const handleAutoAlignLayout = () => {
    const newPos = {};
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const itemsPerRow = isMobile ? 1 : 3;
    const spacingX = isMobile ? 0 : 220;
    const spacingY = 220;
    const startX = isMobile ? 40 : 70;
    const startY = isMobile ? 40 : 60;

    filteredTables.forEach((t, idx) => {
      const col = idx % itemsPerRow;
      const row = Math.floor(idx / itemsPerRow);
      newPos[t.id] = {
        x: startX + col * spacingX,
        y: startY + row * spacingY
      };
    });

    setPositions(prev => ({ ...prev, ...newPos }));
    setHasUnsavedChanges(true);
    toast.success(isMobile ? 'Tables arranged in mobile column!' : 'Tables auto-aligned in clean grid rows!');
  };

  const handleRotate = (tableId) => {
    const currentRot = rotations[tableId] || 0;
    const newRot = (currentRot + 45) % 360;
    setRotations(prev => ({
      ...prev,
      [tableId]: newRot
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSingleTable = (tableId) => {
    const pos = positions[tableId] || { x: 0, y: 0 };
    const rot = rotations[tableId] || 0;

    updateTableMutation.mutate({
      tableId,
      data: { position_x: pos.x, position_y: pos.y, rotation: rot }
    }, {
      onSuccess: () => {
        toast.success(`Position saved for table!`);
      }
    });
  };

  const handleSaveAllPositions = () => {
    let savedCount = 0;
    const totalToSave = Object.keys(positions).length;

    Object.keys(positions).forEach(tableId => {
      const pos = positions[tableId];
      const rot = rotations[tableId] || 0;
      updateTableMutation.mutate({
        tableId,
        data: { position_x: pos.x, position_y: pos.y, rotation: rot }
      }, {
        onSuccess: () => {
          savedCount++;
          if (savedCount === totalToSave) {
            setHasUnsavedChanges(false);
            toast.success('All table layout positions saved!');
          }
        }
      });
    });
  };

  // Helper to determine table dimensions & chair coordinates based on seating count
  const getTableLayoutDimensions = (capacity) => {
    const cap = capacity || 2;
    if (cap <= 2) {
      return { width: 'w-36', height: 'h-36', seatsConfig: '2-seater', widthPx: 144, heightPx: 144 };
    } else if (cap <= 4) {
      return { width: 'w-44', height: 'h-44', seatsConfig: '4-seater', widthPx: 176, heightPx: 176 };
    } else if (cap <= 6) {
      return { width: 'w-60', height: 'h-40', seatsConfig: '6-seater', widthPx: 240, heightPx: 160 };
    } else {
      return { width: 'w-72', height: 'h-44', seatsConfig: '8-seater', widthPx: 288, heightPx: 176 };
    }
  };

  // Helper to render distinct Chairs surrounding the table with physical spacing
  const render3DChairs = (capacity, is3D, dimensions) => {
    const cap = capacity || 2;
    const chairs = [];

    // Render individual chair element with high visibility and modern design
    const createChair = (key, styleProps) => (
      <div
        key={key}
        className={`absolute w-7 h-7 rounded-xl border-2 border-[#DDB892] flex items-center justify-center transition-all hover:scale-110 ${
          is3D 
            ? 'bg-gradient-to-t from-[#6F4E37] via-[#A67B5B] to-[#DDB892] text-white shadow-lg border-white/80' 
            : 'bg-[#6F4E37] text-white shadow-md hover:bg-[#8B5E3C]'
        }`}
        style={{
          ...styleProps,
          transform: `${styleProps.transform || ''} ${is3D ? 'translateZ(14px)' : ''}`,
          boxShadow: is3D ? '0 6px 12px rgba(0,0,0,0.35)' : '0 4px 8px rgba(44, 24, 16, 0.45)'
        }}
      >
        <Armchair className="w-3.5 h-3.5 text-[#FFF8F0] stroke-[2.5]" />
      </div>
    );

    if (cap <= 2) {
      // 2 Seater: 1 Top (North), 1 Bottom (South) with 26px offset spacing
      chairs.push(createChair('c-north', { top: '-28px', left: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-south', { bottom: '-28px', left: 'calc(50% - 14px)' }));
    } else if (cap <= 4) {
      // 4 Seater: 1 North, 1 South, 1 East, 1 West with 28px offset spacing
      chairs.push(createChair('c-north', { top: '-28px', left: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-south', { bottom: '-28px', left: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-west', { left: '-28px', top: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-east', { right: '-28px', top: 'calc(50% - 14px)' }));
    } else if (cap <= 6) {
      // 6 Seater: 2 North, 2 South, 1 West, 1 East
      chairs.push(createChair('c-n1', { top: '-28px', left: '22%' }));
      chairs.push(createChair('c-n2', { top: '-28px', left: '68%' }));
      chairs.push(createChair('c-s1', { bottom: '-28px', left: '22%' }));
      chairs.push(createChair('c-s2', { bottom: '-28px', left: '68%' }));
      chairs.push(createChair('c-w', { left: '-28px', top: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-e', { right: '-28px', top: 'calc(50% - 14px)' }));
    } else {
      // 8 Seater or higher: 3 North, 3 South, 1 West, 1 East
      chairs.push(createChair('c-n1', { top: '-28px', left: '16%' }));
      chairs.push(createChair('c-n2', { top: '-28px', left: '46%' }));
      chairs.push(createChair('c-n3', { top: '-28px', left: '74%' }));
      chairs.push(createChair('c-s1', { bottom: '-28px', left: '16%' }));
      chairs.push(createChair('c-s2', { bottom: '-28px', left: '46%' }));
      chairs.push(createChair('c-s3', { bottom: '-28px', left: '74%' }));
      chairs.push(createChair('c-w', { left: '-28px', top: 'calc(50% - 14px)' }));
      chairs.push(createChair('c-e', { right: '-28px', top: 'calc(50% - 14px)' }));
    }

    return chairs;
  };

  // Collect active table combination links for rendering SVG connecting lines
  const renderCombinationLinks = () => {
    const links = [];
    const tablePosMap = {};

    filteredTables.forEach(t => {
      const pos = positions[t.id] || { x: 0, y: 0 };
      tablePosMap[t.id] = { x: pos.x + 88, y: pos.y + 70, number: t.table_number };
    });

    filteredTables.forEach(table => {
      if (table.is_combinable && Array.isArray(table.combined_with)) {
        table.combined_with.forEach(partner => {
          if (tablePosMap[table.id] && tablePosMap[partner.id]) {
            const p1 = tablePosMap[table.id];
            const p2 = tablePosMap[partner.id];

            links.push(
              <g key={`${table.id}-${partner.id}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx={(p1.x + p2.x) / 2} cy={(p1.y + p2.y) / 2} r="10" fill="#4F46E5" />
                <text 
                  x={(p1.x + p2.x) / 2} 
                  y={(p1.y + p2.y) / 2 + 3} 
                  fill="#FFFFFF" 
                  fontSize="9" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  ⇄
                </text>
              </g>
            );
          }
        });
      }
    });

    return links;
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DDB892]/60 p-5 sm:p-6 shadow-2xs space-y-6 text-[#2C1810]">
      
      {/* Canvas Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] text-white flex items-center justify-center font-extrabold shadow-xs">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2C1810]">Seating Floor Plan Layout</h3>
              <p className="text-[11px] text-text/60 font-medium">Clear 2D View • Drag & Drop Tables • Dynamic Chairs & Combinations</p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Location Filters */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-2xl border border-border/40">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setActiveLocationFilter(loc)}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeLocationFilter === loc
                    ? 'bg-[#6F4E37] text-white shadow-2xs'
                    : 'text-text/65 hover:text-[#2C1810]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Auto Align Layout Button */}
          <button
            onClick={handleAutoAlignLayout}
            className="px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border border-[#DDB892]/80 bg-white hover:bg-[#FFF8F0] text-[#6F4E37] transition-all cursor-pointer shadow-2xs"
            title="Auto Align Tables into Clean Grid Rows"
          >
            <LayoutGrid className="w-4 h-4 text-[#6F4E37]" />
            <span>Auto-Align Grid</span>
          </button>

          {/* Toggle Grid Lines */}
          <button
            onClick={() => setShowGridLines(!showGridLines)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
              showGridLines
                ? 'bg-[#6F4E37] text-white border-transparent'
                : 'bg-white text-[#6F4E37] border-[#DDB892]/80 hover:bg-[#FFF8F0]'
            }`}
            title="Toggle Floor Grid Lines"
          >
            <Grid className="w-4 h-4" />
            <span>Grid</span>
          </button>

          {/* 2D / 3D Mode Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
              is3DMode
                ? 'bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-white border-transparent'
                : 'bg-white text-[#6F4E37] border-[#DDB892]/80 hover:bg-[#FFF8F0]'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{is3DMode ? '3D Isometric View' : '2D Top-Down View'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex bg-surface p-1 rounded-2xl border border-border/40 text-text/70">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 hover:text-[#2C1810] cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-black self-center text-[#2C1810]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
              className="p-1.5 hover:text-[#2C1810] cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Save All Layout Button */}
          {hasUnsavedChanges && (
            <Button
              onClick={handleSaveAllPositions}
              disabled={updateTableMutation.isPending}
              className="py-1.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 animate-bounce"
            >
              <Save className="w-4 h-4" />
              <span>Save Floor Plan Layout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Blueprint Floor Canvas */}
      <div 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[580px] rounded-3xl bg-gradient-to-br from-[#FFF8F0] via-[#FAF0E6] to-[#FFF3E4] border-2 border-dashed border-[#DDB892]/80 overflow-auto custom-scrollbar select-none p-4"
        style={{ perspective: is3DMode ? '1200px' : 'none' }}
      >
        {/* Interactive Mouse Spotlight Radial Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0 opacity-80"
          style={{
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(111, 78, 55, 0.07), transparent 45%)`
          }}
        />

        {/* Blueprint Floor Grid Lines */}
        {showGridLines && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none z-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #6F4E37 1px, transparent 1px),
                linear-gradient(to bottom, #6F4E37 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        )}

        {/* SVG Layer for Joined Combination Links */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {renderCombinationLinks()}
        </svg>

        {/* 3D Floor Matrix Container */}
        <div 
          className="w-full h-full min-h-[520px] relative transition-transform duration-500 ease-out"
          style={{
            transform: is3DMode 
              ? `scale(${zoomLevel}) rotateX(40deg) rotateZ(-10deg)` 
              : `scale(${zoomLevel})`,
            transformStyle: 'preserve-3d'
          }}
        >
          {filteredTables.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-2">
              <Sparkles className="w-10 h-10 text-[#6F4E37] opacity-40 mx-auto" />
              <p className="text-sm font-extrabold text-[#2C1810]">No tables in this layout filter</p>
            </div>
          ) : (
            filteredTables.map((table) => {
              const pos = positions[table.id] || { x: 0, y: 0 };
              const rot = rotations[table.id] || 0;
              const isSelected = selectedTableId === table.id;
              const isActive = table.status === 'ACTIVE';
              const isMaintenance = table.status === 'MAINTENANCE';
              const dim = getTableLayoutDimensions(table.capacity);

              return (
                <motion.div
                  key={table.id}
                  drag
                  dragElastic={0.1}
                  dragMomentum={false}
                  onDragEnd={(e, info) => handleDragEnd(table.id, info)}
                  onClick={() => setSelectedTableId(isSelected ? null : table.id)}
                  onDoubleClick={() => onSelectTable && onSelectTable(table)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.06 }}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    margin: '30px',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: `rotate(${rot}deg)`,
                    transformStyle: 'preserve-3d',
                    zIndex: isSelected ? 30 : 10
                  }}
                  className="cursor-grab active:cursor-grabbing group touch-none"
                >
                  {/* Drop Shadow on Floor */}
                  {is3DMode && (
                    <div 
                      className="absolute -inset-2 bg-black/25 rounded-3xl blur-md pointer-events-none transition-all"
                      style={{ transform: 'translateZ(-15px)' }}
                    />
                  )}

                  {/* Distinct Chairs Surround with Physical Spacing */}
                  {render3DChairs(table.capacity, is3DMode, dim)}

                  {/* Modern Sleek 2D/3D Dark Wood Table Top */}
                  <div
                    className={`relative ${dim.width} ${dim.height} rounded-3xl p-3.5 flex flex-col items-center justify-between text-center transition-all duration-300 shadow-2xl border-2 ${
                      isSelected
                        ? 'ring-4 ring-[#6F4E37] ring-offset-2 border-[#DDB892] bg-gradient-to-br from-[#2C1810] via-[#4A2E1B] to-[#6F4E37] text-white'
                        : isActive
                        ? 'border-[#6F4E37] bg-gradient-to-br from-[#2C1810] via-[#3D2314] to-[#5C3A21] text-white shadow-2xl group-hover:border-[#DDB892]'
                        : isMaintenance
                        ? 'border-amber-500 bg-gradient-to-br from-amber-800 to-amber-950 text-white'
                        : 'border-rose-500 bg-gradient-to-br from-rose-900 to-gray-950 text-white opacity-85'
                    }`}
                    style={{
                      transform: is3DMode ? 'translateZ(20px)' : 'none',
                      boxShadow: is3DMode 
                        ? '0 14px 28px rgba(44, 24, 16, 0.4)' 
                        : '0 10px 25px rgba(44, 24, 16, 0.35)'
                    }}
                  >
                    {/* Header: Table Number Pill & Status Dot */}
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white text-[#2C1810] border border-[#DDB892] shadow-sm tracking-wider">
                        {table.table_number}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded-full border-2 border-white/40 ${
                          isActive ? 'bg-emerald-400 animate-pulse' : isMaintenance ? 'bg-amber-300' : 'bg-rose-400'
                        }`} />
                      </div>
                    </div>

                    {/* Center: Seats Count & Icon */}
                    <div className="flex items-center gap-2 my-1 bg-black/40 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/15 w-full justify-center">
                      <Users className="w-4 h-4 text-[#DDB892]" />
                      <span className="text-xs font-black tracking-tight text-white drop-shadow-xs">
                        {table.capacity} Seats ({table.table_type || `${table.capacity} Seater`})
                      </span>
                    </div>

                    {/* Footer: Joined Combination Badge or Location Tag */}
                    {table.is_combinable && table.combined_with && table.combined_with.length > 0 ? (
                      <span className="text-[10px] font-black truncate w-full px-2 py-1 rounded-xl bg-indigo-600 text-white flex items-center justify-center gap-1.5 shadow-sm border border-indigo-400">
                        <LinkIcon className="w-3.5 h-3.5" /> Paired: {table.combined_with.map(c => c.table_number).join(', ')}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 w-full px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#DDB892] shrink-0" />
                        <span className="text-[11px] font-extrabold tracking-wide uppercase">{table.location || 'Indoor'}</span>
                      </div>
                    )}
                  </div>

                  {/* Popover Controls on Table Click */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-white rounded-2xl border border-[#DDB892] shadow-xl p-2 flex items-center gap-1.5 shrink-0 text-[#2C1810]"
                        style={{ transform: is3DMode ? 'translateZ(50px) rotateX(-40deg) rotateZ(10deg)' : 'none' }}
                      >
                        <button
                          onClick={() => handleRotate(table.id)}
                          className="p-1.5 rounded-xl hover:bg-[#FFF8F0] text-[#6F4E37] text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Rotate Table 45°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Rotate</span>
                        </button>

                        <button
                          onClick={() => onSelectTable && onSelectTable(table)}
                          className="p-1.5 rounded-xl hover:bg-[#FFF8F0] text-[#6F4E37] text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onToggleStatus && onToggleStatus(table)}
                          className="p-1.5 rounded-xl hover:bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Toggle Status"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{table.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveSingleTable(table.id)}
                          className="p-1.5 rounded-xl bg-[#6F4E37] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Save Table Position"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Modern Floor Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs text-text/70 font-semibold">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active & Bookable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600" />
            <span>Joined Combination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Inactive</span>
          </div>
        </div>

        <div className="text-[11px] text-text/50 font-medium">
          💡 <span className="font-bold text-[#2C1810]">Tip:</span> 2-Seaters, 4-Seaters & 6-Seaters render scaled table tops with matching chairs. Joined combinations display glowing linking beams.
        </div>
      </div>

    </div>
  );
};
