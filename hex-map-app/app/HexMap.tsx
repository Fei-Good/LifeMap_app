'use client';

import React from 'react';

interface HexMapProps {
  className?: string;
}

interface Position {
  row: number;
  col: number;
}

const HexMap: React.FC<HexMapProps> = ({ className = '' }) => {
  // 六边形参数
  const hexSize = 40; // 边长
  const hexWidth = hexSize * Math.sqrt(3);
  const hexHeight = hexSize * 2;
  
  // 网格参数
  const rows = 10;
  const cols = 12;
  
  // 主角和目标位置
  const playerPosition: Position = { row: 3, col: 4 };
  const targetPosition: Position = { row: 7, col: 8 };

  // 计算六边形中心点坐标
  const getHexCenter = (row: number, col: number) => {
    const x = col * hexWidth + (row % 2) * (hexWidth / 2);
    const y = row * (hexHeight * 0.75);
    return { x, y };
  };

  // 生成六边形路径
  const getHexPath = (centerX: number, centerY: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = centerX + hexSize * Math.cos(angle);
      const y = centerY + hexSize * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')} Z`;
  };

  // 生成所有六边形
  const hexagons = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const { x, y } = getHexCenter(row, col);
      const path = getHexPath(x, y);
      
      hexagons.push(
        <path
          key={`${row}-${col}`}
          d={path}
          fill="#f3f4f6"
          stroke="#9ca3af"
          strokeWidth="1"
        />
      );
    }
  }

  // 计算主角和目标位置
  const playerCenter = getHexCenter(playerPosition.row, playerPosition.col);
  const targetCenter = getHexCenter(targetPosition.row, targetPosition.col);

  // 计算SVG尺寸
  const svgWidth = cols * hexWidth + hexWidth / 2;
  const svgHeight = rows * hexHeight * 0.75 + hexHeight * 0.25;

  return (
    <div className={`w-full h-screen bg-gray-100 flex items-center justify-center ${className}`}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="max-w-full max-h-full"
      >
        {/* 渲染六边形网格 */}
        {hexagons}
        
        {/* 主角标记 */}
        <circle
          cx={playerCenter.x}
          cy={playerCenter.y}
          r="12"
          fill="#3b82f6"
          stroke="#1d4ed8"
          strokeWidth="2"
        />
        <text
          x={playerCenter.x}
          y={playerCenter.y + 4}
          textAnchor="middle"
          fontSize="12"
          fill="white"
          fontWeight="bold"
        >
          我
        </text>
        
        {/* 目标标记 */}
        <circle
          cx={targetCenter.x}
          cy={targetCenter.y}
          r="10"
          fill="#ef4444"
          stroke="#dc2626"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default HexMap;
