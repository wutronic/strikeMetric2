'use client';

import { useEffect, useState, useCallback } from 'react';
import { PunchAnalysis } from '@/types/punch-analysis';
import { getApiUrl } from '@/config/api';
import ErrorDisplay from '@/components/ErrorDisplay';

interface DashboardStats {
  totalPunches: number;
  averageSpeed: number;
  averageForce: number;
  averageAccuracy: number;
}

export default function Dashboard() {
  const [punchData, setPunchData] = useState<PunchAnalysis[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPunches: 0,
    averageSpeed: 0,
    averageForce: 0,
    averageAccuracy: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPunchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(getApiUrl('punchAnalysis'));
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Punch analysis data not found');
        }
        if (response.status === 401) {
          throw new Error('Please log in to view punch analysis data');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to view this data');
        }
        throw new Error('Failed to fetch punch data');
      }

      const data = await response.json();
      setPunchData(data);
      
      // Calculate stats
      if (data.length > 0) {
        const stats = {
          totalPunches: data.length,
          averageSpeed: data.reduce((acc: number, curr: PunchAnalysis) => acc + (curr.speed || 0), 0) / data.length,
          averageForce: data.reduce((acc: number, curr: PunchAnalysis) => acc + (curr.force || 0), 0) / data.length,
          averageAccuracy: data.reduce((acc: number, curr: PunchAnalysis) => acc + (curr.accuracy || 0), 0) / data.length,
        };
        setStats(stats);
      }
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please check if the backend is running.');
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPunchData();
  }, [fetchPunchData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Punch Analysis Dashboard</h1>
        <ErrorDisplay error={error} onRetry={fetchPunchData} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Punch Analysis Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Punches</h3>
          <p className="text-3xl font-bold">{stats.totalPunches}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Speed</h3>
          <p className="text-3xl font-bold">{stats.averageSpeed.toFixed(2)} m/s</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Force</h3>
          <p className="text-3xl font-bold">{stats.averageForce.toFixed(2)} N</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Average Accuracy</h3>
          <p className="text-3xl font-bold">{stats.averageAccuracy.toFixed(2)}%</p>
        </div>
      </div>

      {/* Recent Punches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Force</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {punchData.map((punch, index) => (
              <tr key={punch.id || index}>
                <td className="px-6 py-4 whitespace-nowrap">{punch.punch_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{punch.speed?.toFixed(2) || '-'} m/s</td>
                <td className="px-6 py-4 whitespace-nowrap">{punch.force?.toFixed(2) || '-'} N</td>
                <td className="px-6 py-4 whitespace-nowrap">{punch.accuracy?.toFixed(2) || '-'}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(punch.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 