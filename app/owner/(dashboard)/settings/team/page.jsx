'use client';
import React from 'react';
import { useTeamMembers } from '@/hooks/settings';
import { TeamTable } from '@/components/settings/TeamTable';
import { LoadingSkeleton } from '@/components/settings/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TeamManagementPage() {
  const { data: teamData, isLoading, isError } = useTeamMembers();
  
  const members = teamData?.data || [];

  const handleInvite = () => {
    toast.error('Invitation system requires backend integration.');
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Team & Roles</h2>
          <p className="text-sm text-text/60">Manage staff access, roles, and permissions.</p>
        </div>
        <Button onClick={handleInvite} className="shrink-0 flex items-center gap-2">
           <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      <TeamTable members={members} />
    </div>
  );
}
