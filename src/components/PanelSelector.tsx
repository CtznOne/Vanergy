import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Panel } from '../types';
import { PanelTop, Plus } from 'lucide-react';
import { panels } from '../services/api';

export function PanelSelector() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [availablePanels, setAvailablePanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addPanel = useStore((state) => state.addPanel);

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const response = await panels.getAll();
        setAvailablePanels(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load panels');
        setLoading(false);
      }
    };

    fetchPanels();
  }, []);

  const handleAddPanel = () => {
    const panel = availablePanels.find(p => p.model === selectedModel);
    if (panel) {
      const newPanel: Panel = {
        ...panel,
        id: crypto.randomUUID(),
        x: 10,
        y: 10,
        rotation: 0,
      };
      addPanel(newPanel);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PanelTop className="w-5 h-5" />
          Loading Panels...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <PanelTop className="w-5 h-5" />
          Error
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <PanelTop className="w-5 h-5" />
        Select Panel
      </h2>
      <div className="space-y-3">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 border rounded-md bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a panel model...</option>
          {availablePanels.map((panel) => (
            <option key={panel.model} value={panel.model}>
              {panel.model} - {panel.watts}W ({panel.width}x{panel.height}cm)
            </option>
          ))}
        </select>
        <button
          onClick={handleAddPanel}
          disabled={!selectedModel}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Place Panel
        </button>
      </div>
    </div>
  );
}