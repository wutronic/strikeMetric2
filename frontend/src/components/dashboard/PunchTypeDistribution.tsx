import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip
} from 'recharts';
import { PunchType } from '@/types/punch';

interface PunchTypeDistributionProps {
    distribution: Record<PunchType, number>;
}

const COLORS = {
    [PunchType.JAB]: '#3B82F6',     // blue
    [PunchType.CROSS]: '#EF4444',   // red
    [PunchType.HOOK]: '#10B981',    // green
    [PunchType.UPPERCUT]: '#F59E0B' // yellow
};

export const PunchTypeDistribution: React.FC<PunchTypeDistributionProps> = ({
    distribution
}) => {
    const data = Object.entries(distribution).map(([type, value]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value
    }));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Punch Type Distribution
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name.toLowerCase() as PunchType]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 