import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import jsQR from 'jsqr';
import { Upload, Trash2, ExternalLink } from 'lucide-react';
import { ToolHeader, ActionButton, SharedCopyButton } from '@/src/components/SharedUI';
import { cn } from '@/src/lib/utils';

export function QRReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDashed, setIsDashed] = useState(false);

  const processImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setResult(code.data);
          setError(null);
        } else {
          setResult(null);
          setError('No QR code found in this image.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDashed(false);
    const file = e.dataTransfer.files[0];
    if (file) processImage(file);
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div id="qr-reader">
      <ToolHeader title="QR Reader" description="Extract information from QR code images" />

      <div className="grid grid-cols-1 gap-8">
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDashed(true); }}
          onDragLeave={() => setIsDashed(false)}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all",
            isDashed ? "border-blue-500 bg-blue-50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-zinc-400 group-hover:text-blue-500 transition-colors">
              <Upload size={24} />
            </div>
            <p className="mb-2 text-sm text-zinc-600 font-semibold">Click to upload or drag and drop</p>
            <p className="text-xs text-zinc-400">PNG, JPG, BMP (Max 5MB)</p>
          </div>
          <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
        </label>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Decoded Content</h3>
              <div className="flex items-center gap-2">
                <SharedCopyButton text={result} />
                <ActionButton onClick={() => { setResult(null); setError(null); }} variant="danger">
                  <Trash2 size={14} />
                  Clear
                </ActionButton>
              </div>
            </div>
            <div className="p-6 bg-zinc-900 rounded-2xl shadow-xl">
              <p className="text-zinc-100 font-mono break-all line-clamp-6 text-lg">{result}</p>
              {isUrl(result) && (
                <a 
                  href={result} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  <ExternalLink size={14} />
                  Open Link
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
