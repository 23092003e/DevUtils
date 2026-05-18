import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolHeader, ActionButton, SharedCopyButton } from '@/src/components/SharedUI';
import { formatBytes, cn } from '@/src/lib/utils';
import { type ToolId } from '@/src/constants';

interface TextConverterProps {
  toolId: ToolId;
}

export function TextConverter({ toolId }: TextConverterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const configs = {
    base64: { name: 'Base64', desc: 'Encode/Decode Base64' },
    hex: { name: 'Hex', desc: 'Convert text to/from Hexadecimal' },
    binary: { name: 'Binary', desc: 'Convert text to/from Binary' },
    ascii: { name: 'ASCII', desc: 'Convert text to/from ASCII codes' },
    url: { name: 'URL', desc: 'Safe URL encoding/decoding' },
    html: { name: 'HTML Entities', desc: 'Convert HTML special characters' },
  };

  const config = configs[toolId as keyof typeof configs];

  const process = useCallback((text: string, currentMode: 'encode' | 'decode') => {
    if (!text) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      let result = '';
      switch (toolId) {
        case 'base64':
          result = currentMode === 'encode' ? btoa(text) : atob(text);
          break;
        case 'hex':
          if (currentMode === 'encode') {
            result = Array.from(text).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
          } else {
            result = text.split(/\s+/).filter(x => x).map(h => String.fromCharCode(parseInt(h, 16))).join('');
          }
          break;
        case 'binary':
          if (currentMode === 'encode') {
            result = Array.from(text).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
          } else {
            result = text.split(/\s+/).filter(x => x).map(b => String.fromCharCode(parseInt(b, 2))).join('');
          }
          break;
        case 'ascii':
          if (currentMode === 'encode') {
            result = Array.from(text).map(c => c.charCodeAt(0)).join(' ');
          } else {
            result = text.split(/\s+/).filter(x => x).map(a => String.fromCharCode(parseInt(a, 10))).join('');
          }
          break;
        case 'url':
          result = currentMode === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text);
          break;
        case 'html':
          if (currentMode === 'encode') {
            const el = document.createElement('div');
            el.innerText = text;
            result = el.innerHTML;
          } else {
            const el = document.createElement('div');
            el.innerHTML = text;
            result = el.innerText;
          }
          break;
      }
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(`Invalid input for ${currentMode === 'encode' ? 'encoding' : 'decoding'}`);
      setOutput('');
    }
  }, [toolId]);

  useEffect(() => {
    const timer = setTimeout(() => process(input, mode), 300);
    return () => clearTimeout(timer);
  }, [input, mode, process]);

  const handleSwap = () => {
    const prevOutput = output;
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(prevOutput);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div id={`text-converter-${toolId}`}>
      <ToolHeader title={config.name} description={config.desc} />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-700 capitalize">
              {mode === 'encode' ? 'Plain Text' : config.name}
            </label>
            <span className="text-[10px] font-mono text-zinc-400">
              {input.length} chars | {formatBytes(input)}
            </span>
          </div>
          <textarea
            id="input-area"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm font-mono"
            placeholder={`Enter ${mode === 'encode' ? 'plain text' : config.name} here...`}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton onClick={handleSwap} variant="secondary">
            <RefreshCw size={16} />
            Swap
          </ActionButton>
          <ActionButton onClick={handleClear} variant="danger">
            <Trash2 size={16} />
            Clear
          </ActionButton>
          <div className="h-6 w-px bg-zinc-200 mx-2" />
          <div className="flex bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('encode')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                mode === 'encode' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              ENCODE
            </button>
            <button
              onClick={() => setMode('decode')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                mode === 'decode' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              DECODE
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-700 capitalize">
              {mode === 'encode' ? config.name : 'Plain Text'}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-400">
                {output.length} chars | {formatBytes(output)}
              </span>
              <SharedCopyButton text={output} />
            </div>
          </div>
          <div className="relative">
            <textarea
              id="output-area"
              readOnly
              value={output}
              className={cn(
                "w-full h-40 p-4 rounded-xl border outline-none transition-all resize-none text-sm font-mono",
                error 
                  ? "bg-red-50 border-red-200 text-red-600" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-800"
              )}
              placeholder="Output will appear here..."
            />
            {error && (
              <div className="absolute top-2 right-2 text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
