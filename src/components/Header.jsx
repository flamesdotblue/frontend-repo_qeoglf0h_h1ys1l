import React from 'react';
import { LineChart } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-900 text-white">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Trade Office</h1>
            <p className="text-xs text-slate-500">Daily PnL and Rate of Change across multiple accounts</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
