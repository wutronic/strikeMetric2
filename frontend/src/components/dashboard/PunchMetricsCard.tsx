import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MetricsCardProps {
    title: string;
    value: number;
    unit: string;
    change?: number;
    changeTimeframe?: string;
    icon?: React.ReactNode;
}

export const PunchMetricsCard: React.FC<MetricsCardProps> = ({
    title,
    value,
    unit,
    change,
    changeTimeframe = 'vs last session',
    icon
}) => {
    const isPositiveChange = change && change > 0;
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {icon && <div className="mr-3">{icon}</div>}
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            </div>
            
            <div className="mt-4">
                <div className="flex items-baseline">
                    <p className="text-3xl font-semibold text-gray-900">
                        {value.toFixed(1)}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">{unit}</p>
                </div>
                
                {change !== undefined && (
                    <div className="flex items-center mt-2">
                        {isPositiveChange ? (
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
                            {Math.abs(change)}%
                        </span>
                        <span className="text-sm text-gray-500 ml-1">
                            {changeTimeframe}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}; 