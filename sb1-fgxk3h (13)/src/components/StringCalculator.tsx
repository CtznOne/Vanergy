import React from 'react';
import { useStore } from '../store';
import { Calculator, Trash2 } from 'lucide-react';
import { VICTRON_MPPTS } from './MPPTManager';

export function StringCalculator() {
  const strings = useStore((state) => state.strings);
  const deleteString = useStore((state) => state.deleteString);

  const calculateString = (string: typeof strings[0]) => {
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

  const getRecommendedMPPT = (calc: ReturnType<typeof calculateString>) => {
    return VICTRON_MPPTS.find(mppt => 
      mppt.maxVolts >= calc.volts &&
      mppt.maxAmps >= calc.amps &&
      mppt.maxWatts >= calc.watts
    );
  };

  if (strings.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5" />
        String Calculations
      </h2>
      <div className="space-y-4">
        {strings.map((string) => {
          const calc = calculateString(string);
          const recommendedMPPT = getRecommendedMPPT(calc);
          
          return (
            <div
              key={string.id}
              className="p-4 bg-gray-50 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{string.name}</div>
                  <div className="text-sm text-gray-500">
                    {string.type === 'series' ? 'Series' : 'Parallel'} Configuration
                  </div>
                </div>
                <button
                  onClick={() => deleteString(string.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Voltage: {calc.volts.toFixed(1)}V</div>
                <div>Current: {calc.amps.toFixed(1)}A</div>
                <div>Power: {calc.watts}W</div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700">Recommended MPPT:</div>
                {recommendedMPPT ? (
                  <div className="text-sm text-blue-600">{recommendedMPPT.model}</div>
                ) : (
                  <div className="text-sm text-red-600">No suitable MPPT found</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}