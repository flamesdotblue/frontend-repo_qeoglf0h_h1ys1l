import React, { useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import AccountManager from './components/AccountManager.jsx';
import EntriesPanel from './components/EntriesPanel.jsx';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [entries, setEntries] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  const addAccount = (account) => {
    setAccounts((prev) => [...prev, { ...account, id: crypto.randomUUID() }]);
  };

  const removeAccount = (id) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    // Also remove related entries to keep view clean
    setEntries((prev) => prev.filter((e) => e.accountId !== id));
  };

  const addEntry = (entry) => {
    setEntries((prev) => [
      { id: crypto.randomUUID(), ...entry },
      ...prev,
    ]);
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => (filterDate ? e.date === filterDate : true));
  }, [entries, filterDate]);

  const metrics = useMemo(() => {
    if (filteredEntries.length === 0) {
      return {
        totalPnl: 0,
        weightedRoc: 0,
        accountsInvolved: 0,
        best: null,
        worst: null,
      };
    }

    let totalPnl = 0;
    let totalCapitalWeighted = 0;

    const entriesWithCalc = filteredEntries.map((e) => {
      const acc = accounts.find((a) => a.id === e.accountId);
      const capital = acc ? Number(acc.capital) : 0;
      const pnl = Number(e.pnl);
      const roc = capital !== 0 ? (pnl / capital) * 100 : 0;
      return { ...e, capital, roc, pnl };
    });

    entriesWithCalc.forEach((row) => {
      totalPnl += row.pnl;
      totalCapitalWeighted += row.capital;
    });

    const weightedRoc = totalCapitalWeighted !== 0 ? (totalPnl / totalCapitalWeighted) * 100 : 0;

    const sortedByPnl = [...entriesWithCalc].sort((a, b) => b.pnl - a.pnl);

    return {
      totalPnl,
      weightedRoc,
      accountsInvolved: new Set(entriesWithCalc.map((r) => r.accountId)).size,
      best: sortedByPnl[0] || null,
      worst: sortedByPnl[sortedByPnl.length - 1] || null,
    };
  }, [filteredEntries, accounts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <SummaryCards metrics={metrics} accounts={accounts} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <AccountManager onAdd={addAccount} onRemove={removeAccount} accounts={accounts} />
          </div>

          <div className="lg:col-span-2">
            <EntriesPanel
              accounts={accounts}
              onAddEntry={addEntry}
              entries={entries}
              setFilterDate={setFilterDate}
              filterDate={filterDate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
