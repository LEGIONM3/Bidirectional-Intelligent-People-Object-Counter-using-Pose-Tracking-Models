import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import StatsPanel from './components/StatsPanel';
import ControlPanel from './components/ControlPanel';
import DrawingCanvas from './components/DrawingCanvas';
import { Activity } from 'lucide-react';

function App() {
    const [stats, setStats] = useState({ entries: 0, exits: 0, current_occupancy: 0, class_breakdown: {} });
    const [videoFeedUrl, setVideoFeedUrl] = useState('');
    const [lines, setLines] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const interval = setInterval(fetchStats, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await api.uploadVideo(file);
                setVideoFeedUrl(`${api.getVideoFeedUrl()}?t=${new Date().getTime()}`);
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        }
    };

    const handleStartLive = async () => {
        try {
            await api.startLiveCamera();
            setVideoFeedUrl(`${api.getVideoFeedUrl()}?t=${new Date().getTime()}`);
        } catch (error) {
            console.error('Error starting live camera:', error);
        }
    };

    const handleResetCount = async () => {
        try {
            await api.resetCount();
            setStats({ entries: 0, exits: 0, current_occupancy: 0, class_breakdown: {} });
        } catch (error) {
            console.error('Error resetting count:', error);
        }
    };

    const handleLinesChange = async (newLines) => {
        setLines(newLines);
        try {
            await api.setLines(newLines, 1.0, 1.0);
        } catch (error) {
            console.error('Error setting lines:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <header className="mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center space-x-3">
                    <Activity className="h-8 w-8 text-emerald-500" />
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        FocusTrack Occ-Mon
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <ControlPanel
                        onUpload={handleVideoUpload}
                        onLive={handleStartLive}
                        onReset={handleResetCount}
                    />
                    <StatsPanel stats={stats} />
                </div>

                <div className="lg:col-span-3">
                    <div className="glass rounded-xl p-4 overflow-hidden relative shadow-2xl">
                        <h2 className="text-xl font-semibold mb-4 text-slate-300">Live Video Feed & Configuration</h2>
                        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center min-h-[500px]">
                            {videoFeedUrl ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={videoFeedUrl} alt="Video Feed" className="w-full h-auto object-contain block" crossOrigin="anonymous" />
                                    <DrawingCanvas onLinesChange={handleLinesChange} lines={lines} />
                                </>
                            ) : (
                                <div className="text-slate-500 flex flex-col items-center">
                                    <Activity className="h-12 w-12 mb-2 opacity-50" />
                                    <p>Start live camera or upload a video to begin tracking</p>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            <strong>Instructions:</strong> Click and drag on the video to draw a goal line.
                            Only one line is needed for entry/exit tracking based on crossing direction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
