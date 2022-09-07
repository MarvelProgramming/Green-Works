import React from 'react';
import './styling.css';
import Box from 'monday-ui-react-core/dist/Box';
import { useColorByTaskPercentage } from '../../hooks/useColorByPercentage';

export default function ProgressCardTask({ task, mondaySettings }) {
  const taskColor = useColorByTaskPercentage(
    task,
    mondaySettings.teamProgressGoal
  );

  return (
    <Box className={`progress-card-task ${taskColor}`}>
      <p className="body-text-02">{task.label}</p>
    </Box>
  );
}
