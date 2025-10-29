import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
      <div className={`p-2 rounded-md ${accent}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const SummaryCards = ({ metrics, accounts }) => {
  const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const rocFormatter = new Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 2,
  });

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        label="Total Accounts"
        value={accounts.length}
        accent="bg-slate-900"
      />
      <StatCard
        icon={DollarSign}
        label="Total PnL (Filtered)"
        value={currencyFormatter.format(metrics.totalPnl || 0)}
        accent="bg-emerald-600"
      />
      <StatCard
        icon={TrendingUp}
        label="Weighted ROC (Filtered)"
        value={rocFormatter.format((metrics.weightedRoc || 0) / 100)}
        accent="bg-indigo-600"
      />
      <StatCard
        icon={TrendingUp}
        label="Active Accounts (Filtered)"
        value={metrics.accountsInvolved || 0}
        accent="bg-slate-700"
      />
    </section>
  );
};

export default SummaryCards;
