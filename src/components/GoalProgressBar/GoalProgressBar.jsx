import React from 'react';
import './styling.css';
import LinearProgressBar from 'monday-ui-react-core/dist/LinearProgressBar';
import Box from 'monday-ui-react-core/dist/Box';
import Flex from 'monday-ui-react-core/dist/Flex';

export default function GoalProgressBar({ mondaySettings }) {
  return (
    <Box className="goal-progress-bar">
      <Flex className="progress-praise top" justify={Flex.justify.END}>
        {/* Added an empty div to take up the first bit of space in the flexbox */}
        <div></div>
        <p className="body-text-03">Half way!</p>
        <p className="body-text-03">Goal!</p>
      </Flex>
      <Box className="progress-area" border={Box.borders.SMALL}>
        <LinearProgressBar
          className="linear-progress-bar_small-wrapper progress"
          value={Math.max(
            (mondaySettings.teamProgress / mondaySettings.teamProgressGoal) *
              100,
            1
          )}
          size={LinearProgressBar.sizes.LARGE}
        />
        {/* Each div here represents a vertical line on the progress bar (minus the last one, but is still needed for spacing) */}
        <div className="divider"></div>
        <div className="divider"></div>
        <div className="divider"></div>
        <div className="divider"></div>
      </Box>
      <Flex className="progress-praise bottom" justify={Flex.justify.END}>
        <p className="body-text-03">Great work!</p>
        <p className="body-text-03">Almost there!</p>
      </Flex>
    </Box>
  );
}
