import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const AccountManager = ({ onAdd, onRemove, accounts }) => {
  const [form, setForm] = useState({ traderName: '', accountName: '', capital: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.traderName || !form.accountName || !form.capital) return;
    const capital = Number(form.capital);
    if (Number.isNaN(capital) || capital <= 0) return;
    onAdd({ traderName: form.traderName.trim(), accountName: form.accountName.trim(), capital });
    setForm({ traderName: '', accountName: '', capital: '' });
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-slate-700 mb-3">Accounts</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Trader name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={form.traderName}
            onChange={(e) => setForm((f) => ({ ...f, traderName: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Account name"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={form.accountName}
            onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Capital (e.g., 50000)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            value={form.capital}
            onChange={(e) => setForm((f) => ({ ...f, capital: e.target.value }))}
            min="0"
            step="any"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Add Account
        </button>
      </form>

      <div className="mt-4 divide-y divide-slate-100">
        {accounts.length === 0 && (
          <p className="text-xs text-slate-500">No accounts yet. Add your first account above.</p>
        )}
        {accounts.map((acc) => (
          <div key={acc.id} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">{acc.accountName}</p>
              <p className="text-xs text-slate-500">{acc.traderName} • Capital: {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(acc.capital)}</p>
            </div>
            <button
              onClick={() => onRemove(acc.id)}
              className="text-slate-500 hover:text-red-600"
              aria-label="Remove account"
              title="Remove account"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccountManager;
