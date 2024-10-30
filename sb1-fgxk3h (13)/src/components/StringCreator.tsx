import React, { useState } from 'react';
import { useStore } from '../store';
import { CircuitBoard } from 'lucide-react';
import { getRecommendedMPPT } from '../utils/mppt';

export function StringCreator() {
  const [type, setType] = React.useState<'series' | 'parallel'>('series');
  const [name, setName] = React.useState('');
  const createString = useStore((state) => state.createString);
  const selectedPanels = useStore((state) => state.selectedPanels);
  const panels = useStore((state) => state.panels);

  const handleCreateString = () => {
    const selectedPanelObjects = panels.filter(p => selectedPanels.includes(p.id));
    if (selectedPanelObjects.length < 2) return;

    createString(type, undefined, name || `String ${Math.random().toString(36).slice(2, 7)}`);
    setName('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <CircuitBoard className="w-5 h-5" />
        Create String
      </h2>
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="String name (optional)"
          className="w-full p-2 border rounded-md focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 px-4 rounded ${
              type === 'series'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setType('series')}
          >
            Series
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded ${
              type === 'parallel'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setType('parallel')}
          >
            Parallel
          </button>
        </div>
        <button
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateString}
          disabled={selectedPanels.length < 2}
        >
          Create String
        </button>
      </div>
    </div>
  );
}