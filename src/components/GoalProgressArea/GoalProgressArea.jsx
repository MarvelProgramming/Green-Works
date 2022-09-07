import React from 'react';
import './styling.css';
import Box from 'monday-ui-react-core/dist/Box';
import GoalProgressBar from '../GoalProgressBar/GoalProgressBar';
import AppreciationText from '../AppreciationText/AppreciationText';

export default function GoalProgressArea({ mondaySettings }) {
  return (
    <Box className="goal-progress-area">
      <GoalProgressBar mondaySettings={mondaySettings} />
      <Box className="goal-description">
        <p className="body-text-03">
          Your team is working toward{' '}
          <span className="goal-focus">{mondaySettings.teamGoal}!</span>
        </p>
        <AppreciationText />
      </Box>
    </Box>
  );
}
