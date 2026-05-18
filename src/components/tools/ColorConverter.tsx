import { useState, useEffect } from 'react';
import { Palette, Share2, Copy } from 'lucide-react';
import { ToolHeader, ActionButton, SharedCopyButton } from '@/src/components/SharedUI';

export function ColorConverter() {
  const [hex, setHex] = useState('#3a7bd5');
  const [rgb, setRgb] = useState({ r: 58, g: 123, b: 213 });
  const [hsl, setHsl] = useState({ h: 215, s: 65, l: 53 });

  const hexToRgb = (hexStr: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexStr);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    if (/^#?([a-f\d]{6})$/i.test(val)) {
      const converted = hexToRgb(val);
      if (converted) {
        setRgb(converted);
        setHsl(rgbToHsl(converted.r, converted.g, converted.b));
      }
    }
  };

  const handleRgbChange = (part: 'r' | 'g' | 'b', val: string) => {
    const num = Math.min(255, Math.max(0, parseInt(val) || 0));
    const newRgb = { ...rgb, [part]: num };
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  return (
    <div id="color-converter">
      <ToolHeader title="Color Converter" description="Convert between Hex, RGB, and HSL formats with live preview" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Preview and Swatch */}
        <div className="space-y-6">
          <div 
            id="color-preview"
            className="w-full h-64 rounded-3xl shadow-inner border border-zinc-200 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden" 
            style={{ backgroundColor: hex }}
          >
            <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white flex flex-col items-center gap-2 shadow-2xl">
              <span className="text-3xl font-black text-zinc-900 font-mono uppercase">{hex}</span>
              <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
                <span>rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-6">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 block">Recommended Palette</label>
              <div className="flex gap-2">
                {[hex, '#0ea5e9', '#ec4899', '#10b981', '#f59e0b'].map(c => (
                   <button 
                    key={c}
                    onClick={() => handleHexChange(c)}
                    className="w-full h-12 rounded-lg border border-white hover:scale-105 transition-transform" 
                    style={{ backgroundColor: c }} 
                   />
                ))}
              </div>
             </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-700">HEX Code</label>
            <div className="relative">
              <input 
                type="text" 
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full p-4 bg-zinc-100 border-none rounded-xl font-mono text-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              <div className="absolute right-2 top-2">
                <SharedCopyButton text={hex} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-700">RGB Values</label>
            <div className="grid grid-cols-3 gap-3">
              {(['r', 'g', 'b'] as const).map(p => (
                <div key={p} className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block ml-1">{p}</span>
                  <input 
                    type="number" 
                    value={rgb[p]}
                    onChange={(e) => handleRgbChange(p, e.target.value)}
                    className="w-full p-3 bg-zinc-100 border-none rounded-xl font-mono text-center focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-zinc-700">HSL Values</label>
            <div className="bg-zinc-100 rounded-xl p-4 flex items-center justify-between">
              <span className="font-mono text-zinc-600">
                hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)
              </span>
              <SharedCopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
