import React from 'react';
import { Users, LogIn, LogOut, BarChart3 } from 'lucide-react';

const StatsPanel = ({ stats }) => {
    return (
        <div className="glass rounded-xl p-6 space-y-6 shadow-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold flex items-center border-b border-slate-700 pb-2">
                <BarChart3 className="mr-2 h-5 w-5 text-cyan-400" /> Real-time Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center justify-center border border-slate-700">
                    <LogIn className="h-6 w-6 text-emerald-400 mb-1" />
                    <span className="text-slate-400 text-sm font-medium">Entries</span>
                    <span className="text-3xl font-bold text-slate-100">{stats.entries || 0}</span>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center justify-center border border-slate-700">
                    <LogOut className="h-6 w-6 text-rose-400 mb-1" />
                    <span className="text-slate-400 text-sm font-medium">Exits</span>
                    <span className="text-3xl font-bold text-slate-100">{stats.exits || 0}</span>
                </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-400 mr-3" />
                    <div>
                        <p className="text-slate-300 text-sm font-medium">Current Occupancy</p>
                        <p className="text-4xl font-black text-blue-300">{stats.current_occupancy || 0}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Object Breakdown</h3>
                {Object.keys(stats.class_breakdown || {}).length > 0 ? (
                    <ul className="space-y-2">
                        {Object.entries(stats.class_breakdown).map(([cls, count]) => (
                            <li key={cls} className="flex justify-between items-center bg-slate-800/80 px-3 py-2 rounded">
                                <span className="capitalize text-slate-300">{cls}</span>
                                <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-sm font-bold">{count}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-sm italic">No objects tracked yet</p>
                )}
            </div>
        </div>
    );
};

export default StatsPanel;
