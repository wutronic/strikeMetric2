import React, { useRef, useState, useEffect } from 'react';
import { PunchType, VideoMarker, Athlete, PunchAnalysis } from '@/types/punch';

interface VideoAnalyzerProps {
    videoUrl: string;
    athletes: Athlete[];
    onMarkerCreate: (marker: Omit<VideoMarker, 'id'>) => void;
    onPunchAnalysisCreate: (analysis: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({
    videoUrl,
    athletes,
    onMarkerCreate,
    onPunchAnalysisCreate
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
    const [selectedPunchType, setSelectedPunchType] = useState<PunchType | null>(null);
    const [markers, setMarkers] = useState<VideoMarker[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime * 1000); // Convert to milliseconds
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => video.removeEventListener('timeupdate', handleTimeUpdate);
    }, []);

    const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!selectedAthlete || !selectedPunchType) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw new rectangle
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            startPos.x,
            startPos.y,
            x - startPos.x,
            y - startPos.y
        );
    };

    const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !selectedAthlete || !selectedPunchType || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const newMarker: Omit<VideoMarker, 'id'> = {
            timestamp: currentTime,
            athleteId: selectedAthlete.id,
            punchAnalysisId: 0, // Will be set when punch analysis is created
            boundingBox: {
                x: Math.min(startPos.x, endX),
                y: Math.min(startPos.y, endY),
                width: Math.abs(endX - startPos.x),
                height: Math.abs(endY - startPos.y)
            },
            confidence: 1.0 // Manual markers are considered 100% confident
        };

        onMarkerCreate(newMarker);
        setIsDrawing(false);

        // Create associated punch analysis
        const newAnalysis: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'> = {
            sessionId: 0, // Should be set by parent component
            athleteId: selectedAthlete.id,
            punchType: selectedPunchType,
            speed: 0, // To be calculated
            force: 0, // To be calculated
            accuracy: 0, // To be calculated
            videoTimestamp: currentTime,
            impactLocation: {
                x: endX,
                y: endY
            }
        };

        onPunchAnalysisCreate(newAnalysis);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Video Analysis
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Athlete
                        </label>
                        <select
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={selectedAthlete?.id || ''}
                            onChange={(e) => setSelectedAthlete(
                                athletes.find(a => a.id === Number(e.target.value)) || null
                            )}
                        >
                            <option value="">Select an athlete...</option>
                            {athletes.map(athlete => (
                                <option key={athlete.id} value={athlete.id}>
                                    {athlete.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Punch Type
                        </label>
                        <select
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={selectedPunchType || ''}
                            onChange={(e) => setSelectedPunchType(e.target.value as PunchType)}
                        >
                            <option value="">Select punch type...</option>
                            {Object.values(PunchType).map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="relative">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full rounded-lg"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                />
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-600">
                    Instructions:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    <li>Select an athlete and punch type</li>
                    <li>Play/pause the video at the desired frame</li>
                    <li>Click and drag to draw a box around the athlete</li>
                    <li>Release to create a marker and analyze the punch</li>
                </ul>
            </div>
        </div>
    );
}; 