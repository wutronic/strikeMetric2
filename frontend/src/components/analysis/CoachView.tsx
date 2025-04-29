import React, { useState } from 'react';
import {
    PunchAnalysis,
    Athlete,
    TrainingSession,
    CoachNote,
    PunchType
} from '@/types/punch';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { PunchTypeDistribution } from '../dashboard/PunchTypeDistribution';

interface CoachViewProps {
    athlete: Athlete;
    sessions: TrainingSession[];
    notes: CoachNote[];
    onAddNote: (note: Omit<CoachNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CoachView: React.FC<CoachViewProps> = ({
    athlete,
    sessions,
    notes,
    onAddNote
}) => {
    const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
    const [noteType, setNoteType] = useState<CoachNote['type']>('technique');
    const [notePriority, setNotePriority] = useState<CoachNote['priority']>('medium');
    const [noteText, setNoteText] = useState('');

    // Calculate progression data
    const progressionData = sessions.map(session => {
        const avgSpeed = session.punchAnalyses.reduce((sum, p) => sum + p.speed, 0) / session.punchAnalyses.length;
        const avgForce = session.punchAnalyses.reduce((sum, p) => sum + p.force, 0) / session.punchAnalyses.length;
        const avgAccuracy = session.punchAnalyses.reduce((sum, p) => sum + p.accuracy, 0) / session.punchAnalyses.length;

        return {
            date: new Date(session.date).toLocaleDateString(),
            speed: avgSpeed,
            force: avgForce,
            accuracy: avgAccuracy
        };
    });

    // Calculate punch type distribution for selected session
    const getPunchDistribution = (analyses: PunchAnalysis[]) => {
        const distribution: Record<PunchType, number> = {
            [PunchType.JAB]: 0,
            [PunchType.CROSS]: 0,
            [PunchType.HOOK]: 0,
            [PunchType.UPPERCUT]: 0
        };

        analyses.forEach(analysis => {
            distribution[analysis.punchType]++;
        });

        return distribution;
    };

    const handleAddNote = () => {
        onAddNote({
            athleteId: athlete.id,
            sessionId: selectedSession?.id,
            note: noteText,
            type: noteType,
            priority: notePriority,
            status: 'open'
        });
        setNoteText('');
    };

    return (
        <div className="space-y-8">
            {/* Athlete Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                    {athlete.profileImage && (
                        <img
                            src={athlete.profileImage}
                            alt={athlete.name}
                            className="w-16 h-16 rounded-full"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{athlete.name}</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Weight:</span> {athlete.weight}kg
                            </div>
                            <div>
                                <span className="font-medium">Height:</span> {athlete.height}cm
                            </div>
                            <div>
                                <span className="font-medium">Reach:</span> {athlete.reach}cm
                            </div>
                            <div>
                                <span className="font-medium">Stance:</span> {athlete.stance}
                            </div>
                            <div>
                                <span className="font-medium">Experience:</span> {Math.floor(athlete.experience / 12)}y {athlete.experience % 12}m
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Over Time</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="speed" stroke="#3B82F6" name="Speed (m/s)" />
                            <Line type="monotone" dataKey="force" stroke="#EF4444" name="Force (N)" />
                            <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Accuracy (%)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Session Analysis */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Session Analysis</h3>
                <select
                    className="w-full border-gray-300 rounded-md shadow-sm mb-4"
                    value={selectedSession?.id || ''}
                    onChange={(e) => setSelectedSession(
                        sessions.find(s => s.id === Number(e.target.value)) || null
                    )}
                >
                    <option value="">Select a session...</option>
                    {sessions.map(session => (
                        <option key={session.id} value={session.id}>
                            {new Date(session.date).toLocaleDateString()}
                        </option>
                    ))}
                </select>

                {selectedSession && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PunchTypeDistribution
                            distribution={getPunchDistribution(selectedSession.punchAnalyses)}
                        />
                        <div>
                            <h4 className="text-md font-medium text-gray-900 mb-2">Session Notes</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        value={noteType}
                                        onChange={(e) => setNoteType(e.target.value as CoachNote['type'])}
                                    >
                                        <option value="technique">Technique</option>
                                        <option value="progress">Progress</option>
                                        <option value="concern">Concern</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        value={notePriority}
                                        onChange={(e) => setNotePriority(e.target.value as CoachNote['priority'])}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Note
                                    </label>
                                    <textarea
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                        rows={3}
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Enter your observations..."
                                    />
                                </div>
                                <button
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                    onClick={handleAddNote}
                                >
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notes History */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Coaching Notes</h3>
                <div className="space-y-4">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`p-4 rounded-lg border-l-4 ${
                                note.priority === 'high'
                                    ? 'border-red-500 bg-red-50'
                                    : note.priority === 'medium'
                                    ? 'border-yellow-500 bg-yellow-50'
                                    : 'border-blue-500 bg-blue-50'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 mr-2 bg-white">
                                        {note.type}
                                    </span>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 bg-white">
                                        {note.status}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700">{note.note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 