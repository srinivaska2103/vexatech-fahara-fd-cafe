'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { ReportExportDialog } from '@/components/analytics/ReportExportDialog';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const router = useRouter();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (data) => {
    setIsExporting(true);
    // Simulate API call for export
    setTimeout(() => {
      setIsExporting(false);
      setIsExportDialogOpen(false);
      toast.success(`${data.format} report for ${data.type} generated successfully! Downloading...`);
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.push('/owner/analytics')} className="mb-4 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Overview
          </Button>
          <AnalyticsHeader 
            title="Business Reports" 
            description="Generate, download, and manage your cafe's analytical reports."
          />
        </div>
        <Button 
          onClick={() => setIsExportDialogOpen(true)}
          className="flex items-center gap-2 shadow-md px-6"
        >
          <Download className="w-4 h-4" /> Create New Report
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h3 className="text-lg font-bold text-text">Recent Reports</h3>
        
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="p-12 text-center">
             <div className="flex justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                   <FileText className="w-8 h-8 text-red-500" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                   <FileSpreadsheet className="w-8 h-8 text-green-600" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                   <File className="w-8 h-8 text-blue-500" />
                </div>
             </div>
             <h4 className="text-xl font-semibold text-text mb-2">No Recent Reports Generated</h4>
             <p className="text-text/60 max-w-md mx-auto mb-6">
               You haven't exported any analytical reports yet. Click the button above to generate your first PDF or CSV report.
             </p>
             <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
               Generate Now
             </Button>
          </div>
        </div>
      </motion.div>

      <ReportExportDialog 
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onConfirm={handleExport}
        isExporting={isExporting}
      />
    </div>
  );
}
