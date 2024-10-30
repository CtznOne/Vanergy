import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Car, Battery } from 'lucide-react';
import { chargers } from '../services/api';
import type { Charger } from '../types';

export function DCDCManager() {
  const [availableChargers, setAvailableChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { selectedCharger, setSelectedCharger, drivingHoursPerDay, setDrivingHoursPerDay } = useStore();

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        const response = await chargers.getAll();
        setAvailableChargers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load DC-DC chargers');
        setLoading(false);
      }
    };

    fetchChargers();
  }, []);

  const calculateDailyCharge = () => {
    if (!selectedCharger) return 0;
    return selectedCharger.maxOutputCurrent * selectedCharger.outputVoltage * 
           selectedCharger.efficiency * drivingHoursPerDay;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5" />
          Loading DC-DC Chargers...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5" />
          Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Car className="w-5 h-5" />
          DC-DC Charging
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select DC-DC Charger
            </label>
            <select
              value={selectedCharger?._id || ''}
              onChange={(e) => {
                const charger = availableChargers.find(c => c._id === e.target.value);
                setSelectedCharger(charger || null);
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose a charger...</option>
              {availableChargers.map((charger) => (
                <option key={charger._id} value={charger._id}>
                  {charger.model} ({charger.maxOutputCurrent}A)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Driving Hours
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={drivingHoursPerDay}
              onChange={(e) => setDrivingHoursPerDay(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {selectedCharger && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="font-medium text-gray-900">Charger Specifications</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Input Voltage Range</div>
                    <div className="font-medium">
                      {selectedCharger.inputVoltageRange.min}V - {selectedCharger.inputVoltageRange.max}V
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Output</div>
                    <div className="font-medium">
                      {selectedCharger.outputVoltage}V / {selectedCharger.maxOutputCurrent}A
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Max Power</div>
                    <div className="font-medium">
                      {(selectedCharger.outputVoltage * selectedCharger.maxOutputCurrent).toFixed(0)}W
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Efficiency</div>
                    <div className="font-medium">{(selectedCharger.efficiency * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-4 h-4" />
                  <div className="font-medium text-gray-900">Daily Charging Output</div>
                </div>
                <div className="text-xl font-bold text-blue-600">
                  {calculateDailyCharge().toFixed(0)} Wh/day
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Based on {drivingHoursPerDay} hours of driving
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}