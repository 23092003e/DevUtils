import { useState, useMemo } from 'react';
import { 
  QrCode, 
  Scan, 
  FileCode, 
  Hash as HashIcon, 
  Binary, 
  Type, 
  Link as LinkIcon, 
  Code, 
  Shield, 
  KeyRound, 
  Palette, 
  Variable,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { TOOLS, type ToolId } from '@/src/constants';

// Tool Components (to be created)
import { QRGenerator } from './components/tools/QRGenerator';
import { QRReader } from './components/tools/QRReader';
import { TextConverter } from './components/tools/TextConverter';
import { HashGenerator } from './components/tools/HashGenerator';
import { JWTDecoder } from './components/tools/JWTDecoder';
import { ColorConverter } from './components/tools/ColorConverter';
import { NumberConverter } from './components/tools/NumberConverter';

const ICON_MAP = {
  QrCode,
  Scan,
  FileCode,
  Hash: HashIcon,
  Binary,
  Type,
  Link: LinkIcon,
  Code,
  Shield,
  KeyRound,
  Palette,
  Variable,
};

export default function App() {
  const [activeToolId, setActiveToolId] = useState<ToolId>('qr-gen');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeTool = useMemo(() => 
    TOOLS.find(t => t.id === activeToolId) || TOOLS[0], 
  [activeToolId]);

  const renderTool = () => {
    switch (activeToolId) {
      case 'qr-gen': return <QRGenerator />;
      case 'qr-read': return <QRReader />;
      case 'hash': return <HashGenerator />;
      case 'jwt': return <JWTDecoder />;
      case 'color': return <ColorConverter />;
      case 'number': return <NumberConverter />;
      case 'base64':
      case 'hex':
      case 'binary':
      case 'ascii':
      case 'url':
      case 'html':
        return <TextConverter toolId={activeToolId} />;
      default: return null;
    }
  };

  return (
    <div id="app-root" className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          "bg-white border-r border-zinc-200 flex flex-col transition-all duration-300 z-30 h-full",
          isSidebarOpen ? "w-72" : "w-0 md:w-20"
        )}
      >
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between min-h-[65px]">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Code size={18} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-zinc-900 text-lg">DevUtils</span>
            </div>
          )}
          <button
            id="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 md:ml-auto"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {TOOLS.map((tool) => {
            const Icon = (ICON_MAP as any)[tool.icon];
            const isActive = activeToolId === tool.id;
            
            return (
              <button
                key={tool.id}
                id={`nav-${tool.id}`}
                onClick={() => {
                  setActiveToolId(tool.id);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isActive ? "bg-blue-100" : "bg-zinc-100 group-hover:bg-zinc-200"
                )}>
                  <Icon size={18} />
                </div>
                {isSidebarOpen && (
                  <span className="text-sm truncate flex-1 text-left">{tool.name}</span>
                )}
                {isSidebarOpen && isActive && (
                  <ChevronRight size={14} className="text-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="p-4 border-t border-zinc-100">
            <div className="bg-zinc-50 rounded-xl p-3">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-600 font-medium">Local Client Only</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 overflow-y-auto relative bg-zinc-50">
        <div className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToolId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-10">
                {renderTool()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
