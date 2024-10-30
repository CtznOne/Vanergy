import React, { useState } from 'react';
import { useStore } from '../store';
import { Battery, Plus, Trash2, Edit2 } from 'lucide-react';

const COMMON_APPLIANCES = [
  { name: 'Refrigerator', watts: 60, defaultHours: 24 },
  { name: 'LED Lights', watts: 10, defaultHours: 6 },
  { name: 'Laptop', watts: 65, defaultHours: 4 },
  { name: 'Water Pump', watts: 100, defaultHours: 1 },
  { name: 'Fan', watts: 30, defaultHours: 8 },
  { name: 'Phone Charger', watts: 5, defaultHours: 3 },
  { name: 'Microwave', watts: 1000, defaultHours: 0.5 },
  { name: 'Coffee Maker', watts: 900, defaultHours: 0.5 },
  { name: 'TV', watts: 100, defaultHours: 4 },
  { name: 'Inverter Losses', watts: 50, defaultHours: 24 }
];

const VICTRON_INVERTERS = [
  { id: 'phoenix-250', model: 'Phoenix 12/250', watts: 250, peakWatts: 400 },
  { id: 'phoenix-500', model: 'Phoenix 12/500', watts: 500, peakWatts: 900 },
  { id: 'phoenix-800', model: 'Phoenix 12/800', watts: 800, peakWatts: 1600 },
  { id: 'phoenix-1200', model: 'Phoenix 12/1200', watts: 1200, peakWatts: 2400 },
  { id: 'multiplus-1600', model: 'MultiPlus 12/1600', watts: 1600, peakWatts: 3000 },
  { id: 'multiplus-3000', model: 'MultiPlus 12/3000', watts: 3000, peakWatts: 6000 }
];

export function BatteryManager() {
  const [selectedAppliance, setSelectedAppliance] = useState('');
  const [customName, setCustomName] = useState('');
  const [watts, setWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [quantity, setQuantity] = useState('1');
  const { appliances, addAppliance, removeAppliance, location, setLocation, panels } = useStore();

  const handleAddAppliance = () => {
    if (selectedAppliance === 'custom') {
      if (customName && watts && hoursPerDay) {
        addAppliance({
          id: crypto.randomUUID(),
          name: customName,
          watts: Number(watts),
          hoursPerDay: Number(hoursPerDay),
          quantity: Number(quantity)
        });
        setCustomName('');
        setWatts('');
        setHoursPerDay('');
        setQuantity('1');
      }
    } else {
      const appliance = COMMON_APPLIANCES.find(a => a.name === selectedAppliance);
      if (appliance) {
        addAppliance({
          id: crypto.randomUUID(),
          name: appliance.name,
          watts: Number(watts || appliance.watts),
          hoursPerDay: Number(hoursPerDay || appliance.defaultHours),
          quantity: Number(quantity)
        });
      }
    }
    setSelectedAppliance('');
    setWatts('');
    setHoursPerDay('');
    setQuantity('1');
  };

  const handleApplianceSelect = (applianceName: string) => {
    setSelectedAppliance(applianceName);
    if (applianceName === 'custom') {
      setWatts('');
      setHoursPerDay('');
    } else {
      const appliance = COMMON_APPLIANCES.find(a => a.name === applianceName);
      if (appliance) {
        setWatts(appliance.watts.toString());
        setHoursPerDay(appliance.defaultHours.toString());
      }
    }
  };

  const calculateDailyConsumption = () => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.hoursPerDay * app.quantity);
    }, 0);
  };

  const calculatePeakUsage = () => {
    return appliances.reduce((total, app) => {
      return total + (app.watts * app.quantity);
    }, 0);
  };

  const calculateDailyProduction = () => {
    const totalWatts = panels.reduce((sum, p) => sum + p.watts, 0);
    return totalWatts * (location?.peakSunHours || 0);
  };

  const getRecommendedInverter = () => {
    const peakUsage = calculatePeakUsage();
    return VICTRON_INVERTERS.find(inverter => 
      inverter.watts >= peakUsage && inverter.peakWatts >= (peakUsage * 2)
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Energy Consumption
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Peak Sun Hours per Day
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={location?.peakSunHours || ''}
            onChange={(e) => setLocation({ peakSunHours: Number(e.target.value) })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter peak sun hours"
          />
        </div>

        <div className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Appliance
              </label>
              <div className="flex gap-4">
                <select
                  value={selectedAppliance}
                  onChange={(e) => handleApplianceSelect(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select an appliance...</option>
                  {COMMON_APPLIANCES.map((app) => (
                    <option key={app.name} value={app.name}>
                      {app.name} ({app.watts}W)
                    </option>
                  ))}
                  <option value="custom">Custom Appliance</option>
                </select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {selectedAppliance && (
              <div className="space-y-4">
                {selectedAppliance === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appliance Name
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter appliance name"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Power Usage (Watts)
                    </label>
                    <input
                      type="number"
                      value={watts}
                      onChange={(e) => setWatts(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter watts"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hours Per Day
                    </label>
                    <input
                      type="number"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter hours"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAddAppliance}
              disabled={!selectedAppliance || (selectedAppliance === 'custom' && (!customName || !watts || !hoursPerDay)) || (!watts || !hoursPerDay)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Appliance
            </button>
          </div>
        </div>

        {appliances.length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Added Appliances</h3>
              {appliances.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div>
                    <div className="font-medium">{app.name}</div>
                    <div className="text-sm text-gray-500">
                      {app.watts}W × {app.hoursPerDay}h × {app.quantity} = {app.watts * app.hoursPerDay * app.quantity}Wh/day
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppliance(app.name === 'Custom' ? 'custom' : app.name);
                        setCustomName(app.name);
                        setWatts(app.watts.toString());
                        setHoursPerDay(app.hoursPerDay.toString());
                        setQuantity(app.quantity.toString());
                        removeAppliance(app.id);
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeAppliance(app.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">System Requirements</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Daily Production</span>
                    <span className="text-lg font-bold text-blue-600">{calculateDailyProduction().toFixed(0)}Wh</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Daily Consumption</span>
                    <span className="text-lg font-bold text-orange-600">{calculateDailyConsumption().toFixed(0)}Wh</span>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Energy</span>
                    <span className="text-lg font-bold text-green-600">
                      {(calculateDailyProduction() - calculateDailyConsumption()).toFixed(0)}Wh
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Peak Power Usage</span>
                    <span className="text-lg font-bold text-yellow-600">{calculatePeakUsage()}W</span>
                  </div>
                </div>
                {getRecommendedInverter() && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Recommended Inverter</span>
                      <span className="text-lg font-bold text-purple-600">
                        {getRecommendedInverter()?.model}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}