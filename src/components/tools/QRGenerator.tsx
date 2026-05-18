import { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Trash2, QrCode } from 'lucide-react';
import { ToolHeader, ActionButton } from '@/src/components/SharedUI';

export function QRGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async (val: string) => {
    if (!val) {
      setQrUrl(null);
      return;
    }
    try {
      const url = await QRCode.toDataURL(val, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorLevel,
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = 'devutils-qr.png';
    link.click();
  };

  return (
    <div id="qr-generator">
      <ToolHeader title="QR Generator" description="Generate QR codes from any text or URL" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Content</label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                generateQR(e.target.value);
              }}
              className="w-full h-40 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm"
              placeholder="Paste URL or type text here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Size (px)</label>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  if (text) generateQR(text);
                }}
                className="w-full p-2.5 bg-zinc-100 border-none rounded-lg text-sm font-medium outline-none"
              >
                {[128, 256, 512].map(s => <option key={s} value={s}>{s} px</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Error Correction</label>
              <select
                value={errorLevel}
                onChange={(e) => {
                  setErrorLevel(e.target.value as any);
                  if (text) generateQR(text);
                }}
                className="w-full p-2.5 bg-zinc-100 border-none rounded-lg text-sm font-medium outline-none"
              >
                {['L', 'M', 'Q', 'H'].map(l => <option key={l} value={l}>{l} level</option>)}
              </select>
            </div>
          </div>

          <ActionButton 
            onClick={() => { setText(''); setQrUrl(null); }} 
            variant="danger" 
            className="w-full"
          >
            <Trash2 size={16} />
            Reset
          </ActionButton>
        </div>

        <div className="flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 p-8 min-h-[300px]">
          {qrUrl ? (
            <div className="space-y-6 text-center">
              <div className="bg-white p-4 rounded-2xl shadow-xl shadow-zinc-200/50 inline-block">
                <img id="qr-result" src={qrUrl} alt="QR Code" className="rounded-lg" />
              </div>
              <ActionButton onClick={handleDownload} variant="primary" className="mx-auto">
                <Download size={16} />
                Download PNG
              </ActionButton>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode size={32} className="text-zinc-300" />
              </div>
              <p className="text-zinc-400 text-sm font-medium">QR code will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
