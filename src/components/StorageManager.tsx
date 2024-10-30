import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Battery, Database, Sun, Moon } from 'lucide-react';
import { batteries } from '../services/api';
import type { Battery as BatteryType } from '../types';

export function StorageManager() {
  const [availableBatteries, setAvailableBatteries] = useState<BatteryType[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { appliances, location, panels } = useStore();

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await batteries.getAll();
        setAvailableBatteries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load batteries');
        setLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  const calculateDailyConsumption = () => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.hoursPerDay * app.quantity);
    }, 0);
  };

  const calculateDailyProduction = () => {
    const totalWatts = panels.reduce((sum, p) => sum + p.watts, 0);
    return totalWatts * (location?.peakSunHours || 0);
  };

  const calculateTotalAh = () => {
    const battery = availableBatteries.find(b => b._id === selectedBattery);
    if (!battery) return 0;
    return battery.amphhours * quantity;
  };

  const calculateUsableAh = () => {
    const battery = availableBatteries.find(b => b._id === selectedBattery);
    if (!battery) return 0;
    
    // Different battery types have different depth of discharge limits
    const dodLimit = {
      'Lithium': 0.8, // 80% DoD
      'AGM': 0.5,     // 50% DoD
      'Flooded': 0.5  // 50% DoD
    }[battery.type] || 0.5;

    return calculateTotalAh() * dodLimit;
  };

  const calculateRuntimeDetails = () => {
    const totalAh = calculateTotalAh();
    const usableAh = calculateUsableAh();
    const dailyConsumptionWh = calculateDailyConsumption();
    const dailyProductionWh = calculateDailyProduction();
    const dailyConsumptionAh = dailyConsumptionWh / 12; // Convert Wh to Ah at 12V

    const battery = availableBatteries.find(b => b._id === selectedBattery);
    if (!battery || dailyConsumptionAh === 0) return null;

    // Without Solar
    const runtimeWithoutSolar = usableAh / dailyConsumptionAh * 24;

    // With Solar
    const netConsumptionWh = Math.max(0, dailyConsumptionWh - dailyProductionWh);
    const netConsumptionAh = netConsumptionWh / 12;
    const runtimeWithSolar = netConsumptionAh === 0 
      ? Infinity 
      : usableAh / netConsumptionAh * 24;

    return {
      batteryType: battery.type,
      totalCapacityAh: totalAh,
      usableCapacityAh: usableAh,
      dailyConsumptionWh,
      dailyConsumptionAh,
      dailyProductionWh,
      runtimeWithoutSolar,
      runtimeWithSolar,
      isNetPositive: dailyProductionWh >= dailyConsumptionWh
    };
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Loading Batteries...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const details = calculateRuntimeDetails();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Battery Storage
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Battery
            </label>
            <select
              value={selectedBattery}
              onChange={(e) => setSelectedBattery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose a battery...</option>
              {availableBatteries.map((battery) => (
                <option key={battery._id} value={battery._id}>
                  {battery.model} ({battery.amphhours}Ah - {battery.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Parallel Configuration)
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {details && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="font-medium text-gray-900">Battery Configuration</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Total Capacity</div>
                    <div className="font-medium">{details.totalCapacityAh} Ah</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Usable Capacity</div>
                    <div className="font-medium">{details.usableCapacityAh.toFixed(1)} Ah</div>
                    <div className="text-xs text-gray-500">
                      Based on {details.batteryType} battery type
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg space-y-2">
                <div className="font-medium text-gray-900">Daily Energy Flow</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Consumption</div>
                    <div className="font-medium">{details.dailyConsumptionWh.toFixed(1)} Wh</div>
                    <div className="text-xs text-gray-500">
                      ({details.dailyConsumptionAh.toFixed(1)} Ah @ 12V)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Solar Production</div>
                    <div className="font-medium">{details.dailyProductionWh.toFixed(1)} Wh</div>
                    <div className="text-xs text-gray-500">
                      {location?.peakSunHours || 0} peak sun hours
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4" />
                    <div className="font-medium text-gray-900">Without Solar</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {details.runtimeWithoutSolar.toFixed(1)} hours
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {(details.runtimeWithoutSolar / 24).toFixed(1)} days
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4" />
                    <div className="font-medium text-gray-900">With Solar</div>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {details.isNetPositive ? '∞' : `${details.runtimeWithSolar.toFixed(1)} hours`}
                  </div>
                  {!details.isNetPositive && (
                    <div className="text-sm text-gray-600 mt-1">
                      {(details.runtimeWithSolar / 24).toFixed(1)} days
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Runtime Explanation</div>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Your battery bank has {details.totalCapacityAh} Ah total capacity, with {details.usableCapacityAh.toFixed(1)} Ah 
                    usable capacity (based on {details.batteryType} battery characteristics).
                  </p>
                  <p>
                    Daily consumption of {details.dailyConsumptionWh.toFixed(1)} Wh ({details.dailyConsumptionAh.toFixed(1)} Ah @ 12V) 
                    means without solar, the batteries would last {(details.runtimeWithoutSolar / 24).toFixed(1)} days.
                  </p>
                  {details.isNetPositive ? (
                    <p className="text-green-600 font-medium">
                      With solar producing {details.dailyProductionWh.toFixed(1)} Wh per day, you're generating more power than you're using! 
                      The batteries will stay charged as long as you have sunlight.
                    </p>
                  ) : (
                    <p>
                      Solar adds {details.dailyProductionWh.toFixed(1)} Wh per day, extending runtime to {(details.runtimeWithSolar / 24).toFixed(1)} days 
                      before requiring a full recharge.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}