import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Zap, Plus } from 'lucide-react';
import { mppts } from '../services/api';
import { MPPT } from '../types';

// Constants for MPPT calculations
const VOLTAGE_TEMP_COEFFICIENT = -0.3; // %/°C
const CURRENT_TEMP_COEFFICIENT = 0.04; // %/°C
const MAX_TEMP = 70; // °C (maximum operating temperature)
const MIN_TEMP = -10; // °C (minimum operating temperature)
const STC_TEMP = 25; // °C (standard test conditions temperature)
const SAFETY_MARGIN = 1.3; // Updated safety margin (30%)

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

  const calculateStringValues = (string) => {
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

  const calculateTemperatureAdjustedValues = (stringValues) => {
    const minTempDelta = MIN_TEMP - STC_TEMP;
    const maxTempDelta = MAX_TEMP - STC_TEMP;

    const maxVoltage = stringValues.volts * (1 + (minTempDelta * VOLTAGE_TEMP_COEFFICIENT / 100));
    const minVoltage = stringValues.volts * (1 + (maxTempDelta * VOLTAGE_TEMP_COEFFICIENT / 100));

    return {
      maxVoltage,
      minVoltage,
      watts: stringValues.watts,
      amps: stringValues.amps
    };
  };

  const calculateLoadPercentage = (string, mpptId) => {
    const mppt = availableMPPTs.find(m => m._id === mpptId);
    if (!mppt) return 0;

    const stringValues = calculateStringValues(string);
    const adjustedValues = calculateTemperatureAdjustedValues(stringValues);

    const voltPercentage = (adjustedValues.maxVoltage / (mppt.maxVolts * SAFETY_MARGIN)) * 100;
    const wattPercentage = (adjustedValues.watts / (mppt.maxWatts * SAFETY_MARGIN)) * 100;
    const ampsPercentage = (adjustedValues.amps / mppt.maxAmps) * 100;

    const minVoltagePercentage = (adjustedValues.minVoltage / mppt.minVolts) * 100;
    if (minVoltagePercentage < 100) {
      return 150;  // Mark as incompatible if minimum voltage requirement is not met
    }

    return Math.max(voltPercentage, wattPercentage, ampsPercentage);
  };

  const getLoadColor = (percentage) => {
    if (percentage > 100) return 'from-red-500 to-red-600';
    if (percentage > 90) return 'from-yellow-500 to-yellow-600';
    if (percentage > 60) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  const getLoadDescription = (percentage) => {
    if (percentage > 100) return 'Incompatible - Voltage/Power exceeded';
    if (percentage > 90) return 'Near Limit - Consider larger MPPT';
    if (percentage > 60) return 'Optimal Load';
    return 'Room for Growth';
  };

  const getMPPTSuggestions = (string) => {
    const stringValues = calculateStringValues(string);
    const adjustedValues = calculateTemperatureAdjustedValues(stringValues);

    return availableMPPTs
      .filter(mppt => {
        const voltageOK = adjustedValues.maxVoltage <= mppt.maxVolts * SAFETY_MARGIN;
        const ampsOK = adjustedValues.amps <= mppt.maxAmps * SAFETY_MARGIN;
        const powerOK = adjustedValues.watts <= mppt.maxWatts * SAFETY_MARGIN;
        const minVoltageOK = adjustedValues.minVoltage >= mppt.minVolts;

        return voltageOK && ampsOK && powerOK && minVoltageOK;
      })
      .sort((a, b) => {
        const aFit = Math.max(
          adjustedValues.maxVoltage / a.maxVolts,
          adjustedValues.watts / a.maxWatts,
          adjustedValues.amps / a.maxAmps
        );
        const bFit = Math.max(
          adjustedValues.maxVoltage / b.maxVolts,
          adjustedValues.watts / b.maxWatts,
          adjustedValues.amps / b.maxAmps
        );

        return Math.abs(0.75 - aFit) - Math.abs(0.75 - bFit);
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        MPPT Assignment
      </h2>
      <div className="space-y-4">
        {strings.map((string) => {
          const stringValues = calculateStringValues(string);
          const adjustedValues = calculateTemperatureAdjustedValues(stringValues);
          const assignedMpptId = mpptAssignments[string.id];
          const loadPercentage = assignedMpptId ? calculateLoadPercentage(string, assignedMpptId) : 0;
          const loadColor = getLoadColor(loadPercentage);
          const loadDescription = getLoadDescription(loadPercentage);
          const suggestions = getMPPTSuggestions(string);

          return (
            <div key={`string-${string.id}`} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <div className="font-medium">{string.name}</div>
                <div className="text-sm text-gray-500">
                  {string.type === 'series' ? 'Series' : 'Parallel'} Configuration
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>
                  STC: {stringValues.volts.toFixed(1)}V / {stringValues.amps.toFixed(1)}A / {stringValues.watts}W
                </div>
                <div className="text-xs text-gray-500">
                  Temperature adjusted: {adjustedValues.maxVoltage.toFixed(1)}V max / {adjustedValues.minVoltage.toFixed(1)}V min
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={assignedMpptId || ''}
                  onChange={(e) => assignMPPT(string.id, e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                >
                  <option value="">Select MPPT</option>
                  {availableMPPTs.map((mppt) => (
                    mppt._id && (
                      <option 
                        key={`mppt-${mppt._id}`} 
                        value={mppt._id}
                        className={suggestions.includes(mppt) ? 'text-green-600' : 'text-gray-500'}
                      >
                        {mppt.model} ({mppt.maxWatts}W)
                        {suggestions.includes(mppt) ? ' (Recommended)' : ''}
                      </option>
                    )
                  ))}
                </select>
                {assignedMpptId && (
                  <button
                    onClick={() => {
                      const mppt = availableMPPTs.find(m => m._id === assignedMpptId);
                      if (mppt) {
                        addPlacedMPPT(mppt);
                      }
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
