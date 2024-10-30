import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Power, Plus } from 'lucide-react';
import { Inverter } from '../types';
import { inverters } from '../services/api';

export function InverterManager() {
  const [availableInverters, setAvailableInverters] = useState<Inverter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { appliances, placedInverter, setPlacedInverter } = useStore();

  useEffect(() => {
    const fetchInverters = async () => {
      try {
        const response = await inverters.getAll();
        setAvailableInverters(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load inverters');
        setLoading(false);
      }
    };

    fetchInverters();
  }, []);

  const calculatePeakUsage = () => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.quantity);
    }, 0);
  };

  const calculateLoadPercentage = (inverter: Inverter) => {
    const peakUsage = calculatePeakUsage();
    const continuousPercentage = (peakUsage / inverter.watts) * 100;
    const peakPercentage = (peakUsage / inverter.peakWatts) * 100;
    return Math.max(continuousPercentage, peakPercentage);
  };

  const getLoadColor = (percentage: number) => {
    if (percentage > 90) return 'from-red-500 to-red-600';
    if (percentage > 60) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getLoadDescription = (percentage: number) => {
    if (percentage > 90) return 'Overloaded - Consider larger inverter';
    if (percentage > 60) return 'Optimal Load';
    return 'Room for Growth';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Power className="w-5 h-5" />
          Loading Inverters...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Power className="w-5 h-5" />
          Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (appliances.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Power className="w-5 h-5" />
          Inverter Assignment
        </h2>
        <p className="text-gray-500">Add appliances in the Battery & Energy tab to see inverter recommendations.</p>
      </div>
    );
  }

  const peakUsage = calculatePeakUsage();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Power className="w-5 h-5" />
          Inverter Assignment
        </h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="font-medium text-gray-900">System Requirements</div>
          <div className="mt-2 text-sm text-gray-600">
            Peak Power: {peakUsage}W
          </div>
        </div>

        <div className="space-y-4">
          {availableInverters.map((inverter) => {
            const loadPercentage = calculateLoadPercentage(inverter);
            const loadColor = getLoadColor(loadPercentage);
            const loadDescription = getLoadDescription(loadPercentage);
            const isSelected = placedInverter?.id === inverter.id;

            return (
              <div key={inverter.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <div className="font-medium text-gray-900">{inverter.model}</div>
                  <div className="text-sm text-gray-600">
                    Continuous: {inverter.watts}W / Peak: {inverter.peakWatts}W
                  </div>
                  <div className="text-sm text-gray-600">
                    Efficiency: {inverter.efficiency}%
                  </div>
                </div>

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

                {loadPercentage <= 90 && (
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="text-green-600 font-medium">✓ Compatible with your setup</div>
                      <div className="text-gray-600">
                        Daily efficiency loss: {((100 - inverter.efficiency) * peakUsage * 0.01).toFixed(0)}W
                      </div>
                    </div>
                    <button
                      onClick={() => setPlacedInverter(inverter)}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium ${
                        isSelected
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {isSelected ? 'Selected' : 'Select Inverter'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}