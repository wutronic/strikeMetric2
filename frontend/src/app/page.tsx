'use client';

import { PunchDataEntry } from '@/components/forms/PunchDataEntry';
import { Athlete, PunchAnalysis, TrainingSession } from '@/types/punch';

// Mock data
const mockAthletes: Athlete[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Mike Johnson' }
];

const mockSessions: TrainingSession[] = [
  { id: 1, date: '2024-04-29', athleteId: 1 },
  { id: 2, date: '2024-04-28', athleteId: 1 },
  { id: 3, date: '2024-04-29', athleteId: 2 },
  { id: 4, date: '2024-04-27', athleteId: 3 }
];

export default function Home() {
  const handleSubmit = (analysis: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Single punch submitted:', analysis);
    // TODO: Implement API call
  };

  const handleBatchSubmit = (analyses: Omit<PunchAnalysis, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    console.log('Combo submitted:', analyses);
    // TODO: Implement API call
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            StrikeMetric
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and analyze your boxing performance
          </p>
        </div>

        <PunchDataEntry
          athletes={mockAthletes}
          sessions={mockSessions}
          onSubmit={handleSubmit}
          onBatchSubmit={handleBatchSubmit}
        />
      </div>
    </div>
  );
}
