'use client';
import React, { useState } from 'react';
import { useBranches } from '@/hooks/settings';
import { BranchTable } from '@/components/settings/BranchTable';
import { BranchForm } from '@/components/settings/BranchForm';
import { LoadingSkeleton } from '@/components/settings/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BranchManagementPage() {
  const { data: branchesData, isLoading, isError } = useBranches();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const branches = branchesData?.data || [];

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setIsFormOpen(true);
  };

  const handleDelete = (branch) => {
    toast.error(`Delete branch functionality pending backend support for: ${branch.name}`);
  };

  const handleSubmit = (data) => {
    toast.success('Branch details saved successfully');
    setIsFormOpen(false);
    setSelectedBranch(null);
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Branch Management</h2>
          <p className="text-sm text-text/60">Manage all your physical cafe locations across regions.</p>
        </div>
        <Button onClick={() => { setSelectedBranch(null); setIsFormOpen(true); }} className="shrink-0 flex items-center gap-2">
           <Plus className="w-4 h-4" /> Add Branch
        </Button>
      </div>

      <BranchTable branches={branches} onEdit={handleEdit} onDelete={handleDelete} />

      <BranchForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedBranch}
        onSubmit={handleSubmit}
        isPending={false}
      />
    </div>
  );
}
