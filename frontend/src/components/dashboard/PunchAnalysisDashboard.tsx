import React from 'react';
import { BoltIcon, FireIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { PunchMetricsCard } from './PunchMetricsCard';
import { PunchTypeDistribution } from './PunchTypeDistribution';
import { PunchMetrics, PunchType } from '@/types/punch';

interface PunchAnalysisDashboardProps {
    metrics: PunchMetrics;
}

export const PunchAnalysisDashboard: React.FC<PunchAnalysisDashboardProps> = ({
    metrics
}) => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Punch Analysis Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <PunchMetricsCard
                    title="Average Speed"
                    value={metrics.averageSpeed}
                    unit="m/s"
                    change={5.2}
                    icon={<BoltIcon className="h-6 w-6 text-blue-500" />}
                />
                
                <PunchMetricsCard
                    title="Average Force"
                    value={metrics.averageForce}
                    unit="N"
                    change={-2.1}
                    icon={<FireIcon className="h-6 w-6 text-red-500" />}
                />
                
                <PunchMetricsCard
                    title="Average Accuracy"
                    value={metrics.averageAccuracy}
                    unit="%"
                    change={3.7}
                    icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PunchTypeDistribution
                    distribution={metrics.punchTypeDistribution}
                />
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Training Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Punches</span>
                            <span className="font-semibold">{metrics.totalPunches}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Best Speed</span>
                            <span className="font-semibold">
                                {(metrics.averageSpeed * 1.2).toFixed(1)} m/s
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Best Force</span>
                            <span className="font-semibold">
                                {(metrics.averageForce * 1.3).toFixed(1)} N
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Best Accuracy</span>
                            <span className="font-semibold">
                                {Math.min(100, metrics.averageAccuracy * 1.15).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 