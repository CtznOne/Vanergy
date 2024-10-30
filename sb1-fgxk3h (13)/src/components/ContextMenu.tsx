import React from 'react';
import { useStore } from '../store';
import { RotateCw, Trash2, Copy } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  panelId: string;
  onClose: () => void;
}

export function ContextMenu({ x, y, panelId, onClose }: ContextMenuProps) {
  const updatePanel = useStore((state) => state.updatePanel);
  const removePanel = useStore((state) => state.removePanel);
  const panels = useStore((state) => state.panels);
  const addPanel = useStore((state) => state.addPanel);

  const handleRotate = () => {
    const panel = panels.find((p) => p.id === panelId);
    if (panel) {
      updatePanel(panelId, {
        rotation: (panel.rotation + 90) % 360,
      });
    }
    onClose();
  };

  const handleDuplicate = () => {
    const panel = panels.find((p) => p.id === panelId);
    if (panel) {
      const newPanel = {
        ...panel,
        id: crypto.randomUUID(),
        x: panel.x + 10,
        y: panel.y + 10,
      };
      addPanel(newPanel);
    }
    onClose();
  };

  const handleDelete = () => {
    removePanel(panelId);
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg py-2 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
        onClick={handleRotate}
      >
        <RotateCw className="w-4 h-4" />
        Rotate 90°
      </button>
      <button
        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
        onClick={handleDuplicate}
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      <button
        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
        onClick={handleDelete}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
}