import { useState, useEffect } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ToolHeader, ActionButton } from '@/src/components/SharedUI';
import { cn } from '@/src/lib/utils';

interface JwtData {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  expDate: string | null;
}

export function JWTDecoder() {
  const [token, setToken] = useState('');
  const [data, setData] = useState<JwtData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = (jwt: string) => {
    if (!jwt) {
      setData(null);
      setError(null);
      return;
    }

    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const signature = parts[2];

      let isExpired = false;
      let expDate = null;

      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        isExpired = payload.exp < now;
        expDate = new Date(payload.exp * 1000).toLocaleString();
      }

      setData({ header, payload, signature, isExpired, expDate });
      setError(null);
    } catch (e) {
      setError('Invalid JWT token. Check header or payload encoding.');
      setData(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => decodeJwt(token), 300);
    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div id="jwt-decoder">
      <ToolHeader title="JWT Decoder" description="Inspect and debug JSON Web Tokens without verification" />

      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-zinc-700">Encoded JWT</label>
            <ActionButton onClick={() => setToken('')} variant="danger">Clear</ActionButton>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full h-24 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none text-xs font-mono"
            placeholder="Paste your JWT here (header.payload.signature)..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
            <ShieldAlert size={18} />
            {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Expiry Badge */}
            <div className={cn(
              "p-4 rounded-xl flex items-center gap-3 border",
              data.isExpired ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
            )}>
              {data.isExpired ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
              <div>
                <p className="text-sm font-bold">{data.isExpired ? 'Token Expired' : 'Token Secure'}</p>
                <p className="text-xs opacity-80">{data.expDate ? `Expires: ${data.expDate}` : 'No expiration date found'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Header</h4>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-[11px] text-pink-400 overflow-x-auto shadow-lg">
                  <pre>{JSON.stringify(data.header, null, 2)}</pre>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Payload</h4>
                <div className="bg-zinc-900 rounded-xl p-4 font-mono text-[11px] text-blue-400 overflow-x-auto shadow-lg">
                  <pre>{JSON.stringify(data.payload, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Signature</h4>
              <div className="bg-zinc-100 rounded-xl p-4 border border-zinc-200">
                <p className="font-mono text-xs text-zinc-500 break-all leading-relaxed">
                  [HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret )]
                </p>
                <p className="font-mono text-xs text-zinc-900 break-all mt-2 bg-white p-2 rounded border border-zinc-200">
                  {data.signature}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
