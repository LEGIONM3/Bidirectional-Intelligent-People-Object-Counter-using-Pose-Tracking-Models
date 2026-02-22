import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas = ({ onLinesChange, lines }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState(null);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        return { x, y };
    };

    const startDrawing = (e) => {
        const coords = getCoordinates(e);
        if (!coords) return;

        setIsDrawing(true);
        setCurrentLine({
            pt1: coords,
            pt2: coords
        });
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const coords = getCoordinates(e);
        if (!coords) return;

        setCurrentLine({
            ...currentLine,
            pt2: coords
        });
    };

    const endDrawing = () => {
        if (!isDrawing || !currentLine) return;
        setIsDrawing(false);

        // Add the new line. For now, we only support a single analytical goal line.
        // We override everything with a 1-line array
        const newLines = [currentLine];
        onLinesChange(newLines);
        setCurrentLine(null);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        lines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.pt1.x * width, line.pt1.y * height);
            ctx.lineTo(line.pt2.x * width, line.pt2.y * height);
            ctx.strokeStyle = '#3b82f6'; // Blue-500
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.fillStyle = '#ef4444'; // Red-500
            ctx.beginPath();
            ctx.arc(line.pt1.x * width, line.pt1.y * height, 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(line.pt2.x * width, line.pt2.y * height, 6, 0, 2 * Math.PI);
            ctx.fill();
        });

        if (currentLine) {
            ctx.beginPath();
            ctx.moveTo(currentLine.pt1.x * width, currentLine.pt1.y * height);
            ctx.lineTo(currentLine.pt2.x * width, currentLine.pt2.y * height);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)'; // Red-500 with opacity
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, [lines, currentLine]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (canvasRef.current) {
                    canvasRef.current.width = entry.contentRect.width;
                    canvasRef.current.height = entry.contentRect.height;
                    // Force re-render of canvas by slightly toggling state or recreating effect logic works implicitly
                    setCurrentLine(prev => prev);
                }
            }
        });

        if (canvasRef.current?.parentElement) {
            resizeObserver.observe(canvasRef.current.parentElement);
        }

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair z-10 touch-none"
        />
    );
};

export default DrawingCanvas;
