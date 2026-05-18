import { useState, useEffect } from 'react';
import md5 from 'blueimp-md5';
import { Shield, Trash2 } from 'lucide-react';
import { ToolHeader, ActionButton, SharedCopyButton } from '@/src/components/SharedUI';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
  });

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const getHash = async (algo: string) => {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const [sha1, sha256, sha512] = await Promise.all([
      getHash('SHA-1'),
      getHash('SHA-256'),
      getHash('SHA-512'),
    ]);

    setHashes({
      md5: md5(text),
      sha1,
      sha256,
      sha512,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => generateHashes(input), 300);
    return () => clearTimeout(timer);
  }, [input]);

  const hashList = [
    { label: 'MD5', value: hashes.md5 },
    { label: 'SHA-1', value: hashes.sha1 },
    { label: 'SHA-256', value: hashes.sha256 },
    { label: 'SHA-512', value: hashes.sha512 },
  ];

  return (
    <div id="hash-generator">
      <ToolHeader title="Hash Generator" description="Compute MD5, SHA-1, SHA-256, and SHA-512 hashes" />

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">Input String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm font-mono"
            placeholder="Enter text to hash..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Results</h3>
            <ActionButton onClick={() => setInput('')} variant="danger">
              <Trash2 size={14} />
              Clear
            </ActionButton>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {hashList.map((h) => (
              <div key={h.label} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 transition-all hover:bg-zinc-100/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">{h.label}</span>
                  <SharedCopyButton text={h.value} />
                </div>
                <p className="text-xs font-mono break-all text-zinc-800 leading-relaxed min-h-[1rem]">
                  {h.value || 'Wait for input...'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
