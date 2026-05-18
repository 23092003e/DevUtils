import { useState, useEffect } from 'react';
import { Variable, Trash2 } from 'lucide-react';
import { ToolHeader, ActionButton, SharedCopyButton } from '@/src/components/SharedUI';

export function NumberConverter() {
  const [val, setVal] = useState('');
  const [sourceBase, setSourceBase] = useState(10);
  const [results, setResults] = useState({
    bin: '',
    oct: '',
    dec: '',
    hex: '',
  });

  const convert = (input: string, base: number) => {
    if (!input) {
      setResults({ bin: '', oct: '', dec: '', hex: '' });
      return;
    }

    try {
      // BigInt to support large numbers
      const num = BigInt(base === 16 ? '0x' + input : base === 2 ? '0b' + input : base === 8 ? '0o' + input : input);
      setResults({
        bin: num.toString(2),
        oct: num.toString(8),
        dec: num.toString(10),
        hex: num.toString(16).toUpperCase(),
      });
    } catch (e) {
      setResults({ bin: 'Invalid', oct: 'Invalid', dec: 'Invalid', hex: 'Invalid' });
    }
  };

  useEffect(() => {
    convert(val, sourceBase);
  }, [val, sourceBase]);

  const bases = [
    { label: 'Binary (Base 2)', key: 'bin' as const, value: results.bin },
    { label: 'Octal (Base 8)', key: 'oct' as const, value: results.oct },
    { label: 'Decimal (Base 10)', key: 'dec' as const, value: results.dec },
    { label: 'Hexadecimal (Base 16)', key: 'hex' as const, value: results.hex },
  ];

  return (
    <div id="number-converter">
      <ToolHeader title="Base Converter" description="Convert numbers between Binary, Octal, Decimal, and Hexadecimal" />

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Input Value</label>
            <input 
              type="text" 
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Enter number..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700">Source Base</label>
            <select
              value={sourceBase}
              onChange={(e) => setSourceBase(Number(e.target.value))}
              className="w-full p-4 h-[62px] bg-zinc-100 border-none rounded-xl text-sm font-bold outline-none"
            >
              <option value={2}>Base 2 (Binary)</option>
              <option value={8}>Base 8 (Octal)</option>
              <option value={10}>Base 10 (Decimal)</option>
              <option value={16}>Base 16 (Hexadecimal)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Conversions</h3>
            <ActionButton onClick={() => setVal('')} variant="danger">Clear</ActionButton>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {bases.map((b) => (
              <div key={b.key} className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <div className="w-1/4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{b.label}</span>
                </div>
                <div className="flex-1 bg-white p-3 rounded-lg border border-zinc-100 font-mono text-sm break-all">
                  {b.value || '-'}
                </div>
                <SharedCopyButton text={b.value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
