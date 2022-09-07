import React from 'react';
import './styling.css';
import MenuModal from '../MenuModal/MenuModal';
import Checkbox from 'monday-ui-react-core/dist/Checkbox';
import useCurrentUser from '../../hooks/useCurrentUser';

export default function WidgetTasksMenu({
  taskMenuAnimation,
  handleCloseSettingsMenu,
  handleOpenSettingsMenu
}) {
  const currentUser = useCurrentUser();

  /**
   * Increases the progress for all tasks that had the 'toggle' state set to 'true', then closes the menu.
   */
  function handleSubmit() {
    const newUserTasks = currentUser.data.tasks.map((task) => ({
      ...task,
      status: task.status + (task.toggle ? 1 : 0)
    }));

    currentUser.updateUserTasks(newUserTasks);
    handleClose();
  }

  /**
   * Invokes the callback prop responsible for making the WidgetSettingsMenu visible.
   */
  function handleOpenSettings() {
    handleOpenSettingsMenu();
  }

  /**
   * Resets the temporary toggle states and starts fading animations.
   */
  function handleClose() {
    handleCloseSettingsMenu();

    const newTasks = currentUser.data.tasks.map((task) => ({
      ...task,
      toggle: false
    }));

    currentUser.updateUserTasks(newTasks);
  }

  /**
   * Updates the toggle state for a task belonging to the active user.
   * The toggle state is used to temporarily store the state of all checkboxes, which are later evaluated when the 'submit' event is raised.
   * @param {object} event - A UI event object.
   * @param {number} idx - The index of the checkbox that raised this event.
   */
  function handleCheckboxChanged(event, idx) {
    const checkedState = event.target.checked;

    const newTask = { ...currentUser.data.tasks[idx] };
    newTask.toggle = checkedState;

    const newTasks = [...currentUser.data.tasks];
    newTasks.splice(idx, 1, newTask);
    currentUser.updateUserTasks(newTasks);
  }

  /**
   * Returns one of two components, based on whether the active user has any tasks assigned to them.
   * @returns A checkbox for each task belonging to the active user, or a paragraph letting the user know that they don't have any tasks.
   */
  function getInteractionComponent() {
    if (currentUser.data.tasks.length > 0)
      return currentUser.data.tasks.map((task, idx) => (
        <Checkbox
          key={idx}
          className="checkbox"
          label={task.label}
          onChange={(event) => handleCheckboxChanged(event, idx)}
          checked={task.toggle}
        />
      ));
    else
      return (
        <p className="body-text-03 notify-text">You don't have any tasks!</p>
      );
  }

  return (
    <MenuModal
      className={taskMenuAnimation}
      title="Green Works"
      submitDisabled={
        currentUser.data.tasks.length === 0 ||
        !currentUser.data.tasks.some((task) => task.toggle)
      }
      handleSubmit={handleSubmit}
      handleClose={handleClose}
    >
      {getInteractionComponent()}
    </MenuModal>
  );
}
