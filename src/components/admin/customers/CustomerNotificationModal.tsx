import React, { useState } from 'react';
import { X, Send, Bell, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { CustomerDetail } from '../../../types/customer';

interface CustomerNotificationModalProps {
  customer: CustomerDetail | null;
  onClose: () => void;
  onSend: (customerName: string, channel: string, subject: string, message: string) => void;
}

export const CustomerNotificationModal: React.FC<CustomerNotificationModalProps> = ({
  customer,
  onClose,
  onSend,
}) => {
  if (!customer) return null;

  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'IN_APP'>('EMAIL');
  const [subject, setSubject] = useState(`[GKN Labs] Important Account Notice for ${customer.name}`);
  const [message, setMessage] = useState(
    `Dear ${customer.name},\n\nThis is an official administrative update regarding your GKN Labs researcher account (${customer.customerCode}).\n\nBest regards,\nGKN Labs Operations Team`
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      onSend(customer.name, channel, subject, message);
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              Draft Customer Notification
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3 font-mono">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-base font-bold text-white">Notification Dispatched</div>
            <p className="text-xs text-slate-400">
              Message queued for transmission via {channel} to {customer.email}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Recipient Summary */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <div className="text-slate-200 font-bold">{customer.name}</div>
                <div className="text-[10px] text-cyan-400">{customer.email}</div>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                Code: {customer.customerCode}
              </div>
            </div>

            {/* Notification Channel */}
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Dispatch Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('EMAIL')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    channel === 'EMAIL'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="h-4 w-4 mx-auto mb-1" />
                  <span>Email Notice</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    channel === 'SMS'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mx-auto mb-1" />
                  <span>SMS Alert</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel('IN_APP')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    channel === 'IN_APP'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Bell className="h-4 w-4 mx-auto mb-1" />
                  <span>In-App Popup</span>
                </button>
              </div>
            </div>

            {/* Subject */}
            {channel === 'EMAIL' && (
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Message Body */}
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1 font-semibold">
                Message Body
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2 font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg flex items-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSending ? 'Sending...' : 'Send Notification'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
