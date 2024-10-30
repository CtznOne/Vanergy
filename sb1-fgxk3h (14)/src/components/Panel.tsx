import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Panel as PanelType } from '../types';
import { useStore } from '../store';

interface PanelProps {
  panel: PanelType;
  scale: number;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function Panel({ panel, scale, onContextMenu }: PanelProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: panel.id,
  });
  const selected = useStore((state) => state.selectedPanels.includes(panel.id));
  const toggleSelection = useStore((state) => state.togglePanelSelection);
  const mountMargin = useStore((state) => state.mountMargin);

  const style = {
    position: 'absolute' as const,
    left: panel.x * scale,
    top: panel.y * scale,
    width: panel.width * scale,
    height: panel.height * scale,
    transform: transform ? CSS.Transform.toString(transform) + ` rotate(${panel.rotation}deg)` : `rotate(${panel.rotation}deg)`,
    cursor: 'move',
    touchAction: 'none',
  };

  const marginStyle = {
    position: 'absolute' as const,
    left: -mountMargin * scale,
    top: -mountMargin * scale,
    right: -mountMargin * scale,
    bottom: -mountMargin * scale,
    border: '2px solid rgba(34, 197, 94, 0.5)',
    borderRadius: '6px',
    pointerEvents: 'none',
  };

  const panelStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundColor: selected ? 'rgba(234, 179, 8, 0.5)' : 'rgba(59, 130, 246, 0.5)',
    border: selected ? '2px solid rgb(234, 179, 8)' : '2px solid rgb(37, 99, 235)',
    borderRadius: '4px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-center"
      onClick={(e) => {
        e.stopPropagation();
        toggleSelection(panel.id);
      }}
      onContextMenu={onContextMenu}
      {...listeners}
      {...attributes}
    >
      <div style={marginStyle} />
      <div style={panelStyle}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xs text-white text-center font-medium pointer-events-none">
            <div>{panel.model}</div>
            <div>{panel.watts}W</div>
          </div>
        </div>
      </div>
    </div>
  );
}