import React from 'react';
import './styling.css';
import Box from 'monday-ui-react-core/dist/Box';

export default function LegendItem({ color, text }) {
  return (
    <Box className="legend-item">
      <Box className={`color-indicator ${color}`}></Box>
      <p className="body-text-03">{text}</p>
    </Box>
  );
}
