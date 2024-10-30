import React from 'react';
import { useStore } from '../store';
import { ListChecks, Trash2, Zap, Power } from 'lucide-react';

export function PlacedComponents() {
  const panels = useStore((state) => state.panels);
  const strings = useStore((state) => state.strings);
  const placedMPPTs = useStore((state) => state.placedMPPTs);
  const placedInverter = useStore((state) => state.placedInverter);
  const removePanel = useStore((state) => state.removePanel);
  const removePlacedMPPT = useStore((state) => state.removePlacedMPPT);
  const setPlacedInverter = useStore((state) => state.setPlacedInverter);

  const getPanelString = (panelId: string) => {
    return strings.find(s => s.panels.some(p => p.id === panelId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ListChecks className="w-5 h-5" />
        Placed Components
      </h2>
      <div className="space-y-4">
        {panels.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Solar Panels</h3>
            {panels.map((panel) => {
              const string = getPanelString(panel.id);
              return (
                <div
                  key={panel.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{panel.model}</div>
                    <div className="text-sm text-gray-600">
                      {panel.watts}W at ({panel.x}, {panel.y})
                    </div>
                    {string && (
                      <div className="text-sm text-blue-600">
                        In string: {string.name}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removePanel(panel.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {placedMPPTs.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">MPPT Controllers</h3>
            {placedMPPTs.map((mppt) => (
              <div
                key={mppt.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {mppt.model}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mppt.maxWatts}W / {mppt.maxVolts}V / {mppt.maxAmps}A
                  </div>
                </div>
                <button
                  onClick={() => removePlacedMPPT(mppt.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {placedInverter && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Inverter</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Power className="w-4 h-4" />
                  {placedInverter.model}
                </div>
                <div className="text-sm text-gray-600">
                  {placedInverter.watts}W / Peak: {placedInverter.peakWatts}W
                </div>
                <div className="text-sm text-gray-600">
                  Efficiency: {placedInverter.efficiency}%
                </div>
              </div>
              <button
                onClick={() => setPlacedInverter(null)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}