import React from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, XCircle, QrCode, ExternalLink } from 'lucide-react';

interface UPIPaymentProps {
  amount: number;
  merchantName?: string;
  defaultUpiId?: string;
  isProcessing: boolean;
  onChangeUpiId: (value: string) => void;
  onValidateUpiId?: (isValid: boolean) => void;
}

const formatINR = (value: number) => value.toFixed(2);

const buildUpiUrl = (upiId: string, merchantName: string, amount: number, note?: string) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: merchantName || 'Merchant',
    am: String(amount),
    cu: 'INR',
  });
  if (note) params.set('tn', note);
  return `upi://pay?${params.toString()}`;
};

const UPIPayment: React.FC<UPIPaymentProps> = ({ amount, merchantName = 'TicketHub', defaultUpiId = '', isProcessing, onChangeUpiId, onValidateUpiId }) => {
  const [upiId, setUpiId] = React.useState(defaultUpiId);
  const [status, setStatus] = React.useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [copied, setCopied] = React.useState<'id' | 'amount' | null>(null);

  const isValidUpi = /^[\w.-]+@[\w.-]+$/.test(upiId);
  React.useEffect(() => { onValidateUpiId && onValidateUpiId(isValidUpi); }, [isValidUpi, onValidateUpiId]);

  const upiUrl = buildUpiUrl(upiId, merchantName, amount, `${merchantName} booking`);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  const copyToClipboard = async (text: string, which: 'id' | 'amount') => {
    try { await navigator.clipboard.writeText(text); setCopied(which); setTimeout(() => setCopied(null), 1500); } catch {}
  };

  return (
    <section className="space-y-4">
      {/* UPI ID input */}
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">UPI ID *</label>
        <input
          type="text"
          value={upiId}
          onChange={(e) => { setUpiId(e.target.value); onChangeUpiId(e.target.value); setStatus('idle'); }}
          placeholder="username@bank"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
            upiId && !isValidUpi ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          aria-invalid={upiId ? (!isValidUpi ? 'true' : 'false') : undefined}
        />
        {!isValidUpi && upiId && <p className="text-red-500 text-xs mt-1">Enter a valid UPI ID (e.g., username@bank)</p>}
      </motion.div>

      {/* Actions: Deep link + QR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900 dark:text-white">Pay with UPI App</h5>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <a
            href={isValidUpi ? upiUrl : undefined}
            onClick={() => isValidUpi && setStatus('pending')}
            className={`block w-full text-center px-4 py-2 rounded-lg ${isValidUpi ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} focus-visible:ring-2 focus-visible:ring-purple-500`}
            aria-disabled={!isValidUpi}
          >
            Open UPI App
          </a>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Opens Google Pay, PhonePe, Paytm or any UPI-enabled app.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-gray-900 dark:text-white">Scan to Pay</h5>
            <QrCode className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <motion.img initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} src={qrSrc} alt="UPI QR code" width={200} height={200} loading="lazy" decoding="async" className="rounded shadow" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Scan with any UPI app to auto-fill UPI ID & amount.</p>
        </motion.div>
      </div>

      {/* Fallback: copy details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => copyToClipboard(upiId, 'id')}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition focus-visible:ring-2 focus-visible:ring-purple-500"
          disabled={!upiId}
        >
          <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy UPI ID {copied === 'id' && '✓'}</span>
        </button>
        <button
          type="button"
          onClick={() => copyToClipboard(formatINR(amount), 'amount')}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <span className="inline-flex items-center gap-2"><Copy className="h-4 w-4" /> Copy Amount ₹{formatINR(amount)}</span>
        </button>
      </div>

      {/* Status indicator (local UX cue) */}
      <div className="flex items-center gap-2 text-sm">
        {status === 'pending' && (<><span className="inline-flex h-2 w-2 bg-yellow-400 rounded-full" /> <span className="text-yellow-700 dark:text-yellow-300">Awaiting confirmation in your UPI app…</span></>)}
        {status === 'success' && (<><CheckCircle className="h-4 w-4 text-green-600" /> <span className="text-green-700 dark:text-green-300">Payment successful</span></>)}
        {status === 'failed' && (<><XCircle className="h-4 w-4 text-red-600" /> <span className="text-red-700 dark:text-red-300">Payment failed</span></>)}
        {status === 'idle' && (<span className="text-gray-500 dark:text-gray-400">Ready to pay</span>)}
      </div>
    </section>
  );
};

export default UPIPayment;

// Sample: Create UPI deep link
// const link = buildUpiUrl('username@bank', 'TicketHub', 499.00, 'Event booking');

