import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { MPPT } from '../types';
import { Zap, Plus } from 'lucide-react';
import { mppts } from '../services/api';

export function MPPTManager() {
  const [availableMPPTs, setAvailableMPPTs] = useState<MPPT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const strings = useStore((state) => state.strings);
  const mpptAssignments = useStore((state) => state.mpptAssignments);
  const assignMPPT = useStore((state) => state.assignMPPT);
  const addPlacedMPPT = useStore((state) => state.addPlacedMPPT);

  useEffect(() => {
    const fetchMPPTs = async () => {
      try {
        const response = await mppts.getAll();
        setAvailableMPPTs(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load MPPTs');
        setLoading(false);
      }
    };

    fetchMPPTs();
  }, []);

  const calculateStringValues = (string: typeof strings[0]) => {
    const { panels, type } = string;
    if (type === 'series') {
      return {
        volts: panels.reduce((sum, p) => sum + p.volts, 0),
        amps: panels[0]?.amps || 0,
        watts: panels.reduce((sum, p) => sum + p.watts, 0),
      };
    } else {
      return {
        volts: panels[0]?.volts || 0,
        amps: panels.reduce((sum, p) => sum + p.amps, 0),
        watts: panels.reduce((sum, p) => sum + p.watts, 0),
      };
    }
  };

  const calculateLoadPercentage = (string: typeof strings[0], mpptId: string) => {
    const mppt = availableMPPTs.find(m => m.id === mpptId);
    if (!mppt) return 0;

    const stringValues = calculateStringValues(string);
    const voltPercentage = (stringValues.volts / mppt.maxVolts) * 100;
    const ampPercentage = (stringValues.amps / mppt.maxAmps) * 100;
    const wattPercentage = (stringValues.watts / mppt.maxWatts) * 100;

    return Math.max(voltPercentage, ampPercentage, wattPercentage);
  };

  const getLoadColor = (percentage: number) => {
    if (percentage > 90) return 'from-red-500 to-red-600';
    if (percentage > 60) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getLoadDescription = (percentage: number) => {
    if (percentage > 90) return 'Overloaded - Consider larger MPPT';
    if (percentage > 60) return 'Optimal Load';
    return 'Room for Growth';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Loading MPPTs...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (strings.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        MPPT Assignment
      </h2>
      <div className="space-y-4">
        {strings.map((string) => {
          const stringValues = calculateStringValues(string);
          const assignedMpptId = mpptAssignments[string.id];
          const loadPercentage = assignedMpptId ? calculateLoadPercentage(string, assignedMpptId) : 0;
          const loadColor = getLoadColor(loadPercentage);
          const loadDescription = getLoadDescription(loadPercentage);

          return (
            <div key={string.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <div className="font-medium">{string.name}</div>
                <div className="text-sm text-gray-500">
                  {string.type === 'series' ? 'Series' : 'Parallel'} Configuration
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>{stringValues.volts.toFixed(1)}V / {stringValues.amps.toFixed(1)}A / {stringValues.watts}W</div>
              </div>
              <div className="flex gap-2">
                <select
                  value={assignedMpptId || ''}
                  onChange={(e) => assignMPPT(string.id, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Select MPPT</option>
                  {availableMPPTs.map((mppt) => (
                    <option key={mppt.id} value={mppt.id}>
                      {mppt.model}
                    </option>
                  ))}
                </select>
                {assignedMpptId && (
                  <button
                    onClick={() => {
                      const mppt = availableMPPTs.find(m => m.id === assignedMpptId);
                      if (mppt) addPlacedMPPT(mppt);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                )}
              </div>
              {assignedMpptId && (
                <div className="space-y-1">
                  <div className="h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${loadColor}`}
                      style={{ width: `${Math.min(100, loadPercentage)}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {loadDescription} ({loadPercentage.toFixed(1)}% load)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}