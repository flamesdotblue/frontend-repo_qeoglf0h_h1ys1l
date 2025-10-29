import React, { useMemo, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

const Row = ({ entry, account, roc }) => {
  const isPositive = Number(entry.pnl) >= 0;
  return (
    <tr className="border-b last:border-b-0">
      <td className="px-3 py-2 text-sm text-slate-700">{entry.date}</td>
      <td className="px-3 py-2 text-sm">{account?.accountName || '—'}</td>
      <td className="px-3 py-2 text-sm">{account?.traderName || '—'}</td>
      <td className="px-3 py-2 text-sm text-right tabular-nums">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(entry.pnl))}</td>
      <td className={`px-3 py-2 text-sm text-right tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>{roc.toFixed(2)}%</td>
    </tr>
  );
};

const EntriesPanel = ({ accounts, onAddEntry, entries, filterDate, setFilterDate }) => {
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), accountId: '', pnl: '' });

  const entriesWithMeta = useMemo(() => {
    return entries.map((e) => {
      const acc = accounts.find((a) => a.id === e.accountId);
      const capital = acc ? Number(acc.capital) : 0;
      const pnl = Number(e.pnl);
      const roc = capital !== 0 ? (pnl / capital) * 100 : 0;
      return { e, acc, roc };
    });
  }, [entries, accounts]);

  const filtered = useMemo(() => {
    return entriesWithMeta.filter(({ e }) => (filterDate ? e.date === filterDate : true));
  }, [entriesWithMeta, filterDate]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!form.accountId || !form.date || form.pnl === '') return;
    onAddEntry({ ...form, pnl: Number(form.pnl) });
    setForm((f) => ({ ...f, pnl: '' }));
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-700">Daily Entries</h2>
          <p className="text-xs text-slate-500">Add daily PnL per account. Rate of change is calculated using the account capital.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-slate-300 px-2 py-1.5">
            <Calendar className="h-4 w-4 text-slate-500" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-sm focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterDate('')}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <select
          value={form.accountId}
          onChange={(e) => setForm((f) => ({ ...f, accountId: e.target.value }))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">Select account</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.accountName} — {a.traderName}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="PnL (e.g., 250)"
          value={form.pnl}
          onChange={(e) => setForm((f) => ({ ...f, pnl: e.target.value }))}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          step="any"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          disabled={accounts.length === 0}
        >
          <Plus className="h-4 w-4" /> Add Entry
        </button>
      </form>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Account</th>
              <th className="px-3 py-2 font-medium">Trader</th>
              <th className="px-3 py-2 font-medium text-right">PnL</th>
              <th className="px-3 py-2 font-medium text-right">ROC</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-sm text-slate-500">
                  No entries yet. Add one above.
                </td>
              </tr>
            )}
            {filtered.map(({ e, acc, roc }) => (
              <Row key={e.id} entry={e} account={acc} roc={roc} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EntriesPanel;
