import { useState } from 'react';
import type { ReactNode } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn, copyToClipboard } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function SharedCopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      id="copy-btn"
      className={cn(
        "p-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2",
        copied ? "bg-green-100 text-green-700" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600",
        className
      )}
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <CheckCircle2 size={16} />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
          >
            <Copy size={16} />
          </motion.div>
        )}
      </AnimatePresence>
      {copied && <span className="text-xs font-medium">Copied!</span>}
    </button>
  );
}

export function ToolHeader({ title, description }: { title: string; description: string }) {
  return (
    <div id="tool-header" className="mb-6">
      <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
      <p className="text-zinc-500 mt-1">{description}</p>
    </div>
  );
}

export function ActionButton({ 
  onClick, 
  children, 
  variant = 'primary', 
  className,
  id
}: { 
  onClick?: () => void; 
  children: ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  id?: string;
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
  };

  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}
