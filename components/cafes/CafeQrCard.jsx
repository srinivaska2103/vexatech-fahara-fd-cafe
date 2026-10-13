'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Download, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Info, 
  RefreshCw,
  Maximize2,
  X,
  Share2,
  Smartphone,
  Eye,
  CheckCircle2,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

export function CafeQrCard({ cafeId, cafeName }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'minimal' | 'table_tent'
  const accessToken = useAuthStore((state) => state.accessToken);

  const fetchQr = async () => {
    if (!cafeId) return;
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/cafes/${cafeId}/qr`);
      const data = response.data;
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to load QR code');
      }

      setQrData(data.data);
    } catch (err) {
      console.error('Cafe QR fetch error:', err);
      const msg = err.response?.data?.message || err.message || 'Could not load QR code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQr();
  }, [cafeId, accessToken]);

  const handleCopy = () => {
    if (!qrData?.landingUrl) return;
    navigator.clipboard.writeText(qrData.landingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = async (customWidth = 1024) => {
    if (!cafeId || !qrData) return;
    try {
      setDownloading(true);
      const response = await axiosInstance.get(`/cafes/${cafeId}/qr/download?width=${customWidth}`, {
        responseType: 'blob'
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fahara-${cafeName ? cafeName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'cafe'}-qr-${qrData.qrCodeId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not download QR image');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = (variant = activeTab) => {
    if (!qrData?.dataUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the QR stand asset');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fahara Stand - ${cafeName || 'Cafe'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background-color: #FAF5EF;
              color: #2C1810;
              padding: 24px;
            }
            .stand-container {
              background: #ffffff;
              border: 3px solid #DDB892;
              border-radius: 32px;
              padding: 44px 36px;
              text-align: center;
              max-width: 440px;
              width: 100%;
              box-shadow: 0 25px 60px -15px rgba(111, 78, 55, 0.15);
              position: relative;
            }
            .badge-brand {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 16px;
              background: #FFF8F0;
              border: 1px solid #DDB892;
              border-radius: 9999px;
              color: #6F4E37;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 30px;
              font-weight: 900;
              line-height: 1.15;
              color: #2C1810;
              margin-bottom: 8px;
            }
            p.sub {
              font-size: 15px;
              color: #6F4E37;
              font-weight: 700;
              margin-bottom: 28px;
            }
            .qr-frame {
              background: #ffffff;
              padding: 20px;
              border-radius: 28px;
              display: inline-block;
              border: 2px solid #F1E5D8;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            }
            img {
              width: 250px;
              height: 250px;
              display: block;
              border-radius: 12px;
            }
            .scan-tip {
              margin-top: 24px;
              font-size: 15px;
              font-weight: 800;
              color: #2C1810;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            .id-tag {
              margin-top: 10px;
              font-family: monospace;
              font-size: 12px;
              font-weight: 600;
              color: #8C7A6B;
              letter-spacing: 0.05em;
            }
            .footer-powered {
              margin-top: 24px;
              padding-top: 18px;
              border-top: 1px dashed #E5D5C5;
              font-size: 11px;
              font-weight: 700;
              color: #A39081;
              letter-spacing: 0.06em;
              text-transform: uppercase;
            }
            @media print {
              body { background: #fff; padding: 0; }
              .stand-container { border: 2.5px solid #2C1810; box-shadow: none; max-width: 100%; border-radius: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="stand-container">
            <div class="badge-brand">✦ Fahara Verified Venue ✦</div>
            <h1>${cafeName || 'Cafe Venue'}</h1>
            <p class="sub">Scan to View Cafe and Book on Fahara</p>
            <div class="qr-frame">
              <img src="${qrData.dataUrl}" alt="Fahara QR Code" />
            </div>
            <p class="scan-tip">📱 Open Camera & Point at QR</p>
            <p class="id-tag">ID: ${qrData.qrCodeId}</p>
            <div class="footer-powered">Powered by Fahara.in</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const isLocalEnv = qrData?.environment !== 'production' && (qrData?.landingUrl?.includes('localhost') || qrData?.landingUrl?.includes('127.0.0.1') || qrData?.landingUrl?.includes('192.168.'));

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-[#E9DAC8] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="p-5 pb-4 border-b border-[#F5EBE1] flex items-center justify-between bg-gradient-to-r from-[#FFFDF9] via-white to-[#FFF9F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6F4E37] to-[#A67B5B] flex items-center justify-center text-white shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-extrabold text-[#2C1810] tracking-tight">
                  Cafe QR Code
                </h4>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Resolves to current live cafe page
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              title="Expand QR Interactive Preview"
              className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-[#6F4E37]/10 hover:text-[#6F4E37] text-stone-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-400">
              <RefreshCw className="w-7 h-7 animate-spin text-[#6F4E37]" />
              <p className="text-xs font-bold text-stone-600">Generating Cafe QR Code...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center space-y-3 bg-rose-50/50 rounded-2xl p-4 border border-rose-100">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-700 font-bold">{error}</p>
              <Button 
                onClick={fetchQr}
                className="text-xs font-bold py-1.5 px-4 rounded-xl bg-white hover:bg-stone-50 border border-rose-200 text-rose-700 mx-auto shadow-2xs"
              >
                Retry Loading
              </Button>
            </div>
          ) : (
            <>
              {/* Interactive QR Display Canvas */}
              <div className="relative group bg-gradient-to-b from-[#FFFDF9] via-[#FAF4ED] to-[#F5ECE0] p-5 rounded-2xl border border-[#E9DAC8]/70 flex flex-col items-center justify-center transition-all duration-300">
                {/* Floating Action Quick Hover Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowModal(true)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-700 shadow-xs text-xs font-bold flex items-center gap-1 transition-all"
                    title="Fullscreen Preview"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#6F4E37]" />
                    <span className="text-[10px]">Preview</span>
                  </button>
                </div>

                {/* QR Code Container */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setShowModal(true)}
                  className="bg-white p-3.5 rounded-2xl border-2 border-[#EADCCB] shadow-md group-hover:shadow-lg transition-all cursor-pointer relative"
                >
                  <img 
                    src={qrData.dataUrl} 
                    alt={`${cafeName || 'Cafe'} QR Code`}
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 bg-[#2C1810]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1 bg-white/95 text-[#6F4E37] text-[10px] font-black rounded-full shadow-md">
                      Click to Enlarge
                    </span>
                  </div>
                </motion.div>

                {/* Subtitle tag */}
                <div className="mt-3.5 text-center space-y-1">
                  <p className="text-xs font-extrabold text-[#6F4E37] tracking-tight">
                    Scan to View Cafe and Book on Fahara
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#DDB892]/60 text-[11px] font-mono font-bold text-stone-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>ID: {qrData.qrCodeId}</span>
                  </div>
                </div>
              </div>

              {/* Destination URL Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-stone-600 uppercase tracking-wider">
                    Cafe QR Destination URL
                  </span>
                  <span className="text-stone-400 font-medium">Permanent Link</span>
                </div>

                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 hover:bg-stone-100/70 border border-stone-200 transition-all text-xs">
                  <span className="truncate flex-1 font-mono text-[11px] text-stone-700 select-all px-1">
                    {qrData.landingUrl}
                  </span>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      copied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white hover:bg-[#6F4E37] text-stone-700 hover:text-white border border-stone-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>

                  <a
                    href={qrData.landingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-[#6F4E37] text-stone-700 hover:text-white border border-stone-200 transition-all"
                    title="Open Destination Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  onClick={() => handleDownload(1024)}
                  disabled={downloading}
                  className="py-2.5 px-3 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2D] text-white text-xs font-extrabold shadow-sm hover:shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Downloading...' : 'Download PNG'}</span>
                </Button>
                <Button
                  onClick={() => handlePrint()}
                  className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FFF8F0] border-2 border-[#DDB892] text-[#2C1810] text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#6F4E37]" />
                  <span>Print Table Stand</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Interactive Fullscreen Stand Mockup Modal */}
      <AnimatePresence>
        {showModal && qrData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#DDB892] flex flex-col"
            >
              {/* Modal Topbar */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#2C1810]">
                      Interactive Table Stand Preview
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      Simulated customer point-of-sale display
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Stand Canvas */}
              <div className="p-6 sm:p-8 bg-[#FAF6F0] flex flex-col items-center justify-center flex-1">
                <div className="w-full max-w-sm bg-white rounded-3xl p-7 border-4 border-[#DDB892] shadow-xl text-center space-y-4 relative">
                  {/* Premium corner embellishment */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Official Partner Venue</span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#2C1810] tracking-tight">
                      {cafeName || 'Cafe Venue'}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-[#6F4E37]">
                      Scan to View Cafe and Book on Fahara
                    </p>
                  </div>

                  {/* QR Image with subtle shadow */}
                  <div className="bg-white p-3 rounded-2xl border-2 border-stone-200 shadow-sm inline-block">
                    <img 
                      src={qrData.dataUrl} 
                      alt="Stand Preview"
                      className="w-52 h-52 object-contain rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#2C1810] flex items-center justify-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#6F4E37]" />
                      <span>Point your camera to explore</span>
                    </p>
                    <p className="text-[11px] font-mono text-stone-400 font-medium">
                      ID: {qrData.qrCodeId}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-dashed border-stone-200 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    Powered by Fahara.in
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-white flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-stone-500 font-medium">
                  High-res asset ready for acrylic stands or posters
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDownload(2048)}
                    className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#2C1810] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ultra HD PNG</span>
                  </Button>
                  <Button
                    onClick={() => handlePrint()}
                    className="py-2 px-4 rounded-xl bg-[#6F4E37] hover:bg-[#5A3E2D] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Stand (A5/A6)</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
