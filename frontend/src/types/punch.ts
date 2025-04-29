export enum PunchType {
    JAB = 'jab',
    CROSS = 'cross',
    HOOK = 'hook',
    UPPERCUT = 'uppercut'
}

export interface Athlete {
    id: number;
    name: string;
}

export interface VideoMarker {
    id: number;
    timestamp: number; // in milliseconds
    athleteId: number;
    punchAnalysisId: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    confidence: number;
}

export interface TrainingSession {
    id: number;
    date: string;
    athleteId: number;
}

export interface PunchAnalysis {
    id: number;
    athleteId: number;
    sessionId: number;
    punchType: PunchType;
    speed: number;
    force: number;
    accuracy: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    combo?: {
        sequence: number;
        comboId: string;
    };
}

export interface PunchMetrics {
    averageSpeed: number;
    averageForce: number;
    averageAccuracy: number;
    totalPunches: number;
    punchTypeDistribution: Record<PunchType, number>;
    // Advanced metrics for coaches
    speedProgression: {
        date: string;
        value: number;
    }[];
    forceProgression: {
        date: string;
        value: number;
    }[];
    commonCombos: {
        sequence: PunchType[];
        frequency: number;
        averageSpeed: number;
        averageForce: number;
    }[];
    weaknesses: {
        punchType: PunchType;
        metric: 'speed' | 'force' | 'accuracy';
        value: number;
        recommendation: string;
    }[];
}

export interface CoachNote {
    id: number;
    athleteId: number;
    sessionId?: number;
    punchAnalysisId?: number;
    timestamp?: number;
    note: string;
    type: 'technique' | 'progress' | 'concern' | 'general';
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'addressed' | 'resolved';
    createdAt: string;
    updatedAt: string;
} 