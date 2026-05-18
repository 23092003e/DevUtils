export type ToolId =
  | 'qr-gen'
  | 'qr-read'
  | 'base64'
  | 'hex'
  | 'binary'
  | 'ascii'
  | 'url'
  | 'html'
  | 'hash'
  | 'jwt'
  | 'color'
  | 'number';

export interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  description: string;
}

export const TOOLS: Tool[] = [
  { id: 'qr-gen', name: 'QR Generator', icon: 'QrCode', description: 'Generate QR codes from text or URLs' },
  { id: 'qr-read', name: 'QR Reader', icon: 'Scan', description: 'Decode QR codes from images' },
  { id: 'base64', name: 'Base64', icon: 'FileCode', description: 'Encode and decode Base64 strings' },
  { id: 'hex', name: 'Hex', icon: 'Hash', description: 'Convert text to and from Hexadecimal' },
  { id: 'binary', name: 'Binary', icon: 'Binary', description: 'Convert text to and from Binary' },
  { id: 'ascii', name: 'ASCII', icon: 'Type', description: 'Convert text to and from ASCII codes' },
  { id: 'url', name: 'URL Encoder', icon: 'Link', description: 'Safely encode and decode URLs' },
  { id: 'html', name: 'HTML Entities', icon: 'Code', description: 'Encode and decode HTML entities' },
  { id: 'hash', name: 'Hash Generator', icon: 'Shield', description: 'MD5, SHA-1, SHA-256, SHA-512' },
  { id: 'jwt', name: 'JWT Decoder', icon: 'KeyRound', description: 'Inspect JWT headers and payloads' },
  { id: 'color', name: 'Color Converter', icon: 'Palette', description: 'Hex, RGB, and HSL conversions' },
  { id: 'number', name: 'Base Converter', icon: 'Variable', description: 'Convert between number bases' },
];
