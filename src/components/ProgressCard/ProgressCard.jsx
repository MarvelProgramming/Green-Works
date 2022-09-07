import React, { useState, useRef } from 'react';
import './styling.css';
import Box from 'monday-ui-react-core/dist/Box';
import Flex from 'monday-ui-react-core/dist/Flex';
import Icon from 'monday-ui-react-core/dist/Icon';
import Avatar from 'monday-ui-react-core/dist/Avatar';
import TextField from 'monday-ui-react-core/dist/TextField';
import ProgressCardTask from '../ProgressCardTask/ProgressCardTask';
import AddTaskIcon from '../../images/add-task-icon.svg';
import { useColorByUserTasksPercentage } from '../../hooks/useColorByPercentage';
import useCurrentUser from '../../hooks/useCurrentUser';
import useFirstName from '../../hooks/useFirstName';

export default function ProgressCard({ user, mondaySettings }) {
  const [currentlyAddingTask, setCurrentlyAddingTask] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const newTaskInputRef = useRef(null);
  const [newTaskInputFocusDelay, setNewTaskInputFocusDelay] = useState(0);
  const avatarBorderColor = useColorByUserTasksPercentage(
    user,
    mondaySettings.teamProgressGoal
  );
  const currentUser = useCurrentUser();
  const userFirstName = useFirstName(user);

  /**
   * Adds a new task to the active user's task list, updates the goal progress bar, and removes focus from the TextField.
   * @param {object} event - The event object belonging to the TextField that raised this event.
   */
  function handleAddNewTask(event) {
    if (event.key === 'Enter') {
      user.tasks.unshift({ label: newTaskInput, status: 0, toggle: false });

      setNewTaskInput('');

      newTaskInputRef.current.value = '';

      event.target.blur();
    }
  }

  function onAddTaskInputChanged(input) {
    setNewTaskInput(input);
  }

  /**
   * Called when the active user clicks the blue '+' button, changing the task creation state to true, and allowing the user to create a new task.
   */
  function onAddTaskCallToActionClicked(event) {
    event.preventDefault();
    setCurrentlyAddingTask(true);

    if (newTaskInputRef.current) {
      clearTimeout(newTaskInputFocusDelay);

      // A hack that gives focus to the new task input. The animations applied to the input make giving it focus non-trivial.
      const focusDelay = setTimeout(() => {
        newTaskInputRef.current.focus();
      });

      setNewTaskInputFocusDelay(focusDelay);
    }
  }

  return (
    <Box
      className={`progress-card ${
        user.id === currentUser.data.id ? 'current-user' : ''
      }`}
    >
      <Box className="avatar-area">
        <Avatar
          className={`avatar ${avatarBorderColor}`}
          size={Avatar.sizes.LARGE}
          type="img"
          src={user.photo_thumb_small}
          withoutBorder
          text="testing"
        />
        <Flex className="name-area" direction={Flex.directions.COLUMN} gap={1}>
          <p className="body-text-03 no-margin">{`${userFirstName}'s`}</p>
          <p className="body-text-03 no-margin">Progress</p>
        </Flex>
      </Box>
      <Flex
        className="task-area"
        direction={Flex.directions.COLUMN}
        align={Flex.align.STRETCH}
      >
        <Box className="interaction-area">
          <Flex
            className={`add-task-call-to-action ${
              currentlyAddingTask ? 'fade-out' : 'fade-in'
            }`}
            justify={Flex.justify.SPACE_BETWEEN}
          >
            <p className="body-text-02">Tasks</p>
            {user.id === currentUser.data.id &&
              currentUser.data.tasks.length < 4 && (
                <Icon
                  iconType={Icon.type.SRC}
                  icon={AddTaskIcon}
                  iconLabel="myicon"
                  iconSize={16}
                  onClick={onAddTaskCallToActionClicked}
                />
              )}
          </Flex>
          {user.id === currentUser.data.id && (
            <TextField
              className={`add-task-input input-body-text-03 ${
                currentlyAddingTask ? 'fade-in' : 'fade-out'
              }`}
              placeholder="Type here..."
              onBlur={() => setCurrentlyAddingTask(false)}
              onKeyDown={handleAddNewTask}
              onChange={onAddTaskInputChanged}
              setRef={(ref) => (newTaskInputRef.current = ref)}
              value={newTaskInput}
            />
          )}
        </Box>
        <Box
          className={`task-list-container ${
            user.tasks.length > 4 ? 'scroller' : ''
          }`}
        >
          <Flex
            className="task-list"
            direction={Flex.directions.COLUMN}
            align={Flex.align.STRETCH}
          >
            {user.tasks.map((task, idx) => (
              <ProgressCardTask
                key={idx}
                task={task}
                mondaySettings={mondaySettings}
              />
            ))}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
