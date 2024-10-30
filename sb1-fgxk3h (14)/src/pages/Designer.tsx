import React, { useState } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useStore } from '../store';
import { Grid } from '../components/Grid';
import { PanelSelector } from '../components/PanelSelector';
import { StringCreator } from '../components/StringCreator';
import { StringCalculator } from '../components/StringCalculator';
import { PlacedComponents } from '../components/PlacedComponents';
import { ContextMenu } from '../components/ContextMenu';
import { MPPTManager } from '../components/MPPTManager';
import { BatteryManager } from '../components/BatteryManager';
import { InverterManager } from '../components/InverterManager';
import { Panel } from '../components/Panel';
import { LayoutDashboard, Zap, Battery, Power } from 'lucide-react';

const tabs = [
  { id: 'design', label: 'Design', icon: LayoutDashboard },
  { id: 'mppt', label: 'MPPT', icon: Zap },
  { id: 'energy', label: 'Energy Usage', icon: Battery },
  { id: 'inverter', label: 'Inverter', icon: Power }
];

export function Designer() {
  const [activeTab, setActiveTab] = useState('design');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    panelId: string;
  } | null>(null);

  const {
    roofWidth,
    roofHeight,
    mountMargin,
    panels,
    setRoofDimensions,
    setMountMargin,
    updatePanel
  } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (active) {
      const panel = panels.find(p => p.id === active.id);
      if (panel) {
        updatePanel(active.id as string, {
          x: Math.max(0, Math.min(roofWidth - panel.width, panel.x + delta.x)),
          y: Math.max(0, Math.min(roofHeight - panel.height, panel.y + delta.y))
        });
      }
    }
  };

  const scale = Math.min(
    800 / roofWidth,
    600 / roofHeight
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-8">
          <div>
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-bold mb-4">Roof Dimensions</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Width (cm)</label>
                      <input
                        type="number"
                        value={roofWidth}
                        onChange={(e) => setRoofDimensions(Number(e.target.value), roofHeight)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                      <input
                        type="number"
                        value={roofHeight}
                        onChange={(e) => setRoofDimensions(roofWidth, Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mount Margin (cm)</label>
                      <input
                        type="number"
                        value={mountMargin}
                        onChange={(e) => setMountMargin(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Roof Designer</h2>
                    <div
                      className="relative bg-gray-50 border-2 border-gray-200 rounded-lg overflow-hidden"
                      style={{
                        width: roofWidth * scale,
                        height: roofHeight * scale
                      }}
                    >
                      <Grid width={roofWidth} height={roofHeight} scale={scale} />
                      {panels.map((panel) => (
                        <Panel
                          key={panel.id}
                          panel={panel}
                          scale={scale}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              panelId: panel.id
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </DndContext>

                <div className="grid grid-cols-3 gap-6">
                  <PanelSelector />
                  <StringCreator />
                  <StringCalculator />
                </div>
              </div>
            )}

            {activeTab === 'mppt' && <MPPTManager />}
            {activeTab === 'energy' && <BatteryManager />}
            {activeTab === 'inverter' && <InverterManager />}
          </div>

          <PlacedComponents />
        </div>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            panelId={contextMenu.panelId}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </div>
  );
}