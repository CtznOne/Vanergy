import React from 'react';

interface GridProps {
  width: number;
  height: number;
  scale: number;
}

export function Grid({ width, height, scale }: GridProps) {
  const gridSize = 5; // 5cm grid
  const numLinesX = Math.floor(width / gridSize);
  const numLinesY = Math.floor(height / gridSize);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width * scale}
      height={height * scale}
    >
      {Array.from({ length: numLinesX + 1 }).map((_, i) => (
        <line
          key={`x${i}`}
          x1={i * gridSize * scale}
          y1={0}
          x2={i * gridSize * scale}
          y2={height * scale}
          stroke="#ddd"
          strokeWidth={i % 10 === 0 ? 0.5 : 0.25}
        />
      ))}
      {Array.from({ length: numLinesY + 1 }).map((_, i) => (
        <line
          key={`y${i}`}
          x1={0}
          y1={i * gridSize * scale}
          x2={width * scale}
          y2={i * gridSize * scale}
          stroke="#ddd"
          strokeWidth={i % 10 === 0 ? 0.5 : 0.25}
        />
      ))}
    </svg>
  );
}