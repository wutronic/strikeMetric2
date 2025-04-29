import React, { useState } from 'react';
import { PunchType, PunchAnalysis, Athlete, TrainingSession } from '@/types/punch';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PunchDataEntryProps {
    athletes: Athlete[];
    sessions: TrainingSession[];
    onSubmit: (analysis: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onBatchSubmit: (analyses: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

interface ComboEntry {
    id: string;
    punchType: PunchType;
    speed?: number;
    force?: number;
    accuracy?: number;
}

const COMMON_COMBOS = {
    'Basic 1-2': [PunchType.JAB, PunchType.CROSS],
    'Triple Hook': [PunchType.HOOK, PunchType.HOOK, PunchType.HOOK],
    'Body Head': [PunchType.HOOK, PunchType.UPPERCUT],
    '1-2-3': [PunchType.JAB, PunchType.CROSS, PunchType.HOOK],
};

// New SortableItem component
const SortableItem = ({ entry, index, onRemove }: { 
    entry: ComboEntry; 
    index: number;
    onRemove: () => void;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: entry.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between bg-white p-3 mb-2 rounded-md shadow-sm"
            {...attributes}
            {...listeners}
        >
            <span>
                {index + 1}. {entry.punchType}
            </span>
            <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700"
            >
                ×
            </button>
        </div>
    );
};

export const PunchDataEntry: React.FC<PunchDataEntryProps> = ({
    athletes,
    sessions,
    onSubmit,
    onBatchSubmit
}) => {
    const [selectedAthlete, setSelectedAthlete] = useState<number | ''>('');
    const [selectedSession, setSelectedSession] = useState<number | ''>('');
    const [isComboMode, setIsComboMode] = useState(false);
    const [comboEntries, setComboEntries] = useState<ComboEntry[]>([]);
    
    // Single punch entry state
    const [punchType, setPunchType] = useState<PunchType | ''>('');
    const [speed, setSpeed] = useState<string>('');
    const [force, setForce] = useState<string>('');
    const [accuracy, setAccuracy] = useState<string>('');
    const [notes, setNotes] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAthlete || !selectedSession || !punchType) return;

        const analysis: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'> = {
            athleteId: Number(selectedAthlete),
            sessionId: Number(selectedSession),
            punchType,
            speed: Number(speed) || 0,
            force: Number(force) || 0,
            accuracy: Number(accuracy) || 0,
            notes: notes || undefined
        };

        onSubmit(analysis);
        resetForm();
    };

    const handleComboSubmit = () => {
        if (!selectedAthlete || !selectedSession || comboEntries.length === 0) return;

        const analyses = comboEntries.map((entry, index) => ({
            athleteId: Number(selectedAthlete),
            sessionId: Number(selectedSession),
            punchType: entry.punchType,
            speed: entry.speed || 0,
            force: entry.force || 0,
            accuracy: entry.accuracy || 0,
            combo: {
                sequence: index + 1,
                comboId: Date.now().toString()
            }
        }));

        onBatchSubmit(analyses);
        setComboEntries([]);
    };

    const addToCombo = (punchType: PunchType) => {
        setComboEntries([
            ...comboEntries,
            {
                id: Date.now().toString(),
                punchType
            }
        ]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setComboEntries((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const resetForm = () => {
        setPunchType('');
        setSpeed('');
        setForce('');
        setAccuracy('');
        setNotes('');
    };

    const applyComboTemplate = (punches: PunchType[]) => {
        const newEntries = punches.map(punchType => ({
            id: Date.now().toString() + Math.random(),
            punchType
        }));
        setComboEntries(newEntries);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
                Punch Data Entry
            </h3>

            {/* Mode Switch */}
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-l-md ${!isComboMode ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    onClick={() => setIsComboMode(false)}
                >
                    Single Punch
                </button>
                <button
                    className={`px-4 py-2 rounded-r-md ${isComboMode ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    onClick={() => setIsComboMode(true)}
                >
                    Combo
                </button>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Athlete
                    </label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={selectedAthlete}
                        onChange={(e) => setSelectedAthlete(e.target.value ? Number(e.target.value) : '')}
                    >
                        <option value="">Select athlete...</option>
                        {athletes.map(athlete => (
                            <option key={athlete.id} value={athlete.id}>
                                {athlete.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Training Session
                    </label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm"
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value ? Number(e.target.value) : '')}
                    >
                        <option value="">Select session...</option>
                        {sessions.map(session => (
                            <option key={session.id} value={session.id}>
                                {new Date(session.date).toLocaleDateString()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!isComboMode ? (
                // Single Punch Form
                <form onSubmit={handleSingleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Punch Type
                        </label>
                        <select
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={punchType}
                            onChange={(e) => setPunchType(e.target.value as PunchType)}
                            required
                        >
                            <option value="">Select type...</option>
                            {Object.values(PunchType).map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Speed (m/s)
                            </label>
                            <input
                                type="number"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value)}
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Force (N)
                            </label>
                            <input
                                type="number"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                value={force}
                                onChange={(e) => setForce(e.target.value)}
                                step="0.1"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Accuracy (%)
                            </label>
                            <input
                                type="number"
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                value={accuracy}
                                onChange={(e) => setAccuracy(e.target.value)}
                                step="1"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            className="w-full border-gray-300 rounded-md shadow-sm"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Save Punch Data
                    </button>
                </form>
            ) : (
                // Combo Mode
                <div className="space-y-6">
                    {/* Common combos buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(COMMON_COMBOS).map(([name, combo]) => (
                            <button
                                key={name}
                                onClick={() => applyComboTemplate(combo)}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    {/* Punch type buttons */}
                    <div className="flex space-x-2">
                        {Object.values(PunchType).map(type => (
                            <button
                                key={type}
                                onClick={() => addToCombo(type)}
                                className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Draggable combo list */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-md p-4">
                            <SortableContext
                                items={comboEntries.map(entry => entry.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {comboEntries.map((entry, index) => (
                                    <SortableItem
                                        key={entry.id}
                                        entry={entry}
                                        index={index}
                                        onRemove={() => {
                                            const newEntries = [...comboEntries];
                                            newEntries.splice(index, 1);
                                            setComboEntries(newEntries);
                                        }}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </DndContext>

                    {comboEntries.length > 0 && (
                        <button
                            onClick={handleComboSubmit}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Save Combo
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}; 