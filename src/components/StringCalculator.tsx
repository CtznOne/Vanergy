import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Calculator, Trash2 } from 'lucide-react';
import { mppts } from '../services/api';
import { MPPT } from '../types';

const SAFETY_MARGIN_FACTOR = 1.3; // 30% safety margin factor
const VOLTAGE_BUFFER = 5; // 5V buffer between max string voltage and MPPT max voltage

export function StringCalculator() {
  const [availableMPPTs, setAvailableMPPTs] = useState<MPPT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const strings = useStore((state) => state.strings);
  const deleteString = useStore((state) => state.deleteString);

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

  const calculateString = (string: typeof strings[0]) => {
    const { panels, type } = string;
    if (type === 'series') {
      return {
        volts: panels.reduce((sum, p) => sum + p.volts, 0),
        amps: panels[0]?.amps || 0,
        watts: panels.reduce((sum, p) => sum + p.watts, 0),
        openCircuitVolts: panels.reduce((sum, p) => sum + p.volts * 1.25, 0), // Open-circuit voltage with 25% safety margin
      };
    } else {
      return {
        volts: panels[0]?.volts || 0,
        amps: panels.reduce((sum, p) => sum + p.amps, 0),
        watts: panels.reduce((sum, p) => sum + p.watts, 0),
        openCircuitVolts: (panels[0]?.volts || 0) * 1.25, // Open-circuit voltage with 25% safety margin
      };
    }
  };

 const getRecommendedMPPT = (calc: ReturnType<typeof calculateString>) => {
  const maxAmps = calc.amps * SAFETY_MARGIN_FACTOR;
  const maxPower = calc.watts;
  const maxVoltage = calc.volts * SAFETY_MARGIN_FACTOR;
  const openCircuitVoltage = calc.openCircuitVolts;
  const minMPPTVoltage = Math.max(maxVoltage, openCircuitVoltage) + VOLTAGE_BUFFER;

  console.log("---- Calculating for String ----");
  console.log("  STC Voltage:", calc.volts, "V");
  console.log("  Max Voltage with Safety Margin:", maxVoltage, "V");
  console.log("  Current:", calc.amps, "A");
  console.log("  Max Amps with Safety Margin:", maxAmps, "A");
  console.log("  Power:", calc.watts, "W");
  console.log("  Open Circuit Voltage:", openCircuitVoltage, "V");
  console.log("  Minimum MPPT Voltage Required:", minMPPTVoltage, "V");
  console.log("---- Available MPPTs ----");

  const suitableMPPT = availableMPPTs.find(mppt => {
    const voltageCheck = maxVoltage < mppt.maxVolts;
    const ampsCheck = maxAmps < mppt.maxAmps;
    const powerCheck = maxPower < mppt.maxWatts * 1.3;
    const voltageBufferCheck = (maxVoltage >= (mppt.maxAmps + VOLTAGE_BUFFER));

    // Logging each MPPT and each check result
    console.log(`MPPT Model: ${mppt.model}`);
    console.log(`  - Max Voltage Check: ${voltageCheck} (Needed: ${maxVoltage}V, Available: ${mppt.maxVolts}V)`);
    console.log(`  - Amps Check: ${ampsCheck} (Needed: ${maxAmps}A, Available: ${mppt.maxAmps}A)`);
    console.log(`  - Power Check: ${powerCheck} (Needed: ${maxPower}W, Available: ${mppt.maxWatts}W * 1.3 = ${mppt.maxWatts * 1.3}W)`);
    console.log(`  - Voltage Buffer Check: ${voltageBufferCheck} (Needed: ${maxVoltage}V, Required: ${mppt.maxAmps + VOLTAGE_BUFFER}V)`);

    // Final decision log for this MPPT
    const isSuitable = voltageCheck && ampsCheck && powerCheck && voltageBufferCheck;
    console.log(`  => ${mppt.model} is ${isSuitable ? "suitable" : "not suitable"}\n`);

    return isSuitable;
  });

  if (!suitableMPPT) {
    console.log("No suitable MPPT found for this configuration.");
  }

  return suitableMPPT;
};

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Loading Calculations...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
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
                <div>STC Voltage: {calc.volts.toFixed(1)}V</div>
                <div>Current: {calc.amps.toFixed(1)}A</div>
                <div>Power: {calc.watts}W</div>
                <div>Max Voltage with Safety Margin: {(calc.volts * SAFETY_MARGIN_FACTOR).toFixed(1)}V</div>
                <div>Max Amps with Safety Margin: {(calc.amps * SAFETY_MARGIN_FACTOR).toFixed(1)}A</div>
                <div>Original Power: {calc.watts}W</div>
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
