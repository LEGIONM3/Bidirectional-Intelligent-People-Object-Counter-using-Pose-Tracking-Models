import React, { useRef } from 'react';
import { Camera, Upload, RefreshCw, Settings2 } from 'lucide-react';

const ControlPanel = ({ onUpload, onLive, onReset }) => {
    const fileInputRef = useRef(null);

    return (
        <div className="glass rounded-xl p-6 space-y-4 shadow-lg border border-slate-700 bg-slate-800/50">
            <h2 className="text-xl font-semibold flex items-center border-b border-slate-700 pb-2">
                <Settings2 className="mr-2 h-5 w-5 text-purple-400" /> Controls
            </h2>

            <div className="space-y-3 pt-2">
                <button
                    onClick={onLive}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium shadow-md shadow-emerald-900/20"
                >
                    <Camera className="mr-2 h-4 w-4" /> Start Live Camera
                </button>

                <div className="relative">
                    <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-md shadow-blue-900/20"
                    >
                        <Upload className="mr-2 h-4 w-4" /> Upload Video file
                    </button>
                </div>

                <button
                    onClick={onReset}
                    className="w-full flex items-center justify-center py-2.5 px-4 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg transition-colors font-medium mt-6 border border-rose-500/50 shadow-md shadow-rose-900/20"
                >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Counters
                </button>
            </div>
        </div>
    );
};

export default ControlPanel;
