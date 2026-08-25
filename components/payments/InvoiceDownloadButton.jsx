import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

export const InvoiceDownloadButton = ({ invoiceId, onDownload, isDownloading }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1.5 whitespace-nowrap"
      onClick={(e) => {
        e.stopPropagation();
        onDownload(invoiceId);
      }}
      isLoading={isDownloading}
    >
      <Download className="w-3.5 h-3.5" /> Download
    </Button>
  );
};
