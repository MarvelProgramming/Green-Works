import React, { useState, useEffect, useRef } from 'react';
import './styling.css';
import Icon from 'monday-ui-react-core/dist/Icon';
import Box from 'monday-ui-react-core/dist/Box';
import GreenWorksIcon from '../../images/green_works_widget_icon.svg';
import WidgetTasksMenu from '../WidgetTasksMenu/WidgetTasksMenu';
import WidgetSettingsMenu from '../WidgetSettingsMenu/WidgetSettingsMenu';
import useClickOutside from 'monday-ui-react-core/dist/useClickOutside';

export default function MainWidget() {
  const [tasksMenuEnabled, setTasksMenuEnabled] = useState(false);
  const [taskMenuAnimation, setTaskMenuAnimation] = useState('');
  const [settingsMenuEnabled, setSettingsMenuEnabled] = useState(false);
  const [settingsMenuAnimation, setSettingsMenuAnimation] = useState('');
  const [interactive, setInteractive] = useState(false);
  const menuRef = useRef(null);

  useClickOutside({
    ref: menuRef,
    callback: handleClickedOutsideOfMenus
  });

  /**
   * Closes the menus if they're open.
   */
  function handleClickedOutsideOfMenus() {
    if (tasksMenuEnabled) handleCloseTasksMenu();
    if (settingsMenuEnabled) handleCloseSettingsMenu(false);
  }

  /**
   * Opens the settings menu, navigating away from the tasks menu, playing a fade animation.
   */
  function handleOpenSettingsMenu() {
    setTasksMenuEnabled(false);
    setSettingsMenuEnabled(true);
    setTaskMenuAnimation('fade-out');
    setSettingsMenuAnimation('fade-in');
  }

  /**
   * Closes the settings menu, returning the user back to the tasks menu, playing a fade animation.
   * @param {boolean} openTasksMenu - A flag for whether the tasks menu should open when the settings menu closes.
   */
  function handleCloseSettingsMenu(openTasksMenu = true) {
    setSettingsMenuEnabled(false);
    setSettingsMenuAnimation('fade-out');

    if (openTasksMenu) {
      setTasksMenuEnabled(true);
      setTaskMenuAnimation('fade-in');
    }
  }

  /**
   * Opens the tasks menu, playing a fade animation.
   */
  function handleOpenTasksMenu() {
    if (tasksMenuEnabled || settingsMenuEnabled || !interactive) return;

    setTasksMenuEnabled(true);
    setTaskMenuAnimation('slide-in-from-top');
  }

  /**
   * Closes the tasks menu, playing a fade animation.
   */
  function handleCloseTasksMenu() {
    setTasksMenuEnabled(false);
    setTaskMenuAnimation('fade-out');
  }

  useEffect(() => {
    // Prevents the active user from interacting with the widget until it's stopped animating.
    const interactiveDelay = setTimeout(() => {
      setInteractive(true);
    }, 1000);

    return () => {
      clearTimeout(interactiveDelay);
      setInteractive(false);
    };
  }, []);

  return (
    <Box className="main-widget">
      <Box className="main-widget-slideout">
        <p className="main-widget-text">Hi Green Works is ready for you</p>
      </Box>
      <Icon
        iconType={Icon.type.SRC}
        icon={GreenWorksIcon}
        iconLabel="my src awesome icon"
        className="icon-story-custom-icon main-widget-icon"
        onClick={handleOpenTasksMenu}
      />
      <div ref={menuRef}>
        <WidgetTasksMenu
          taskMenuAnimation={taskMenuAnimation}
          handleCloseSettingsMenu={handleCloseTasksMenu}
          handleOpenSettingsMenu={handleOpenSettingsMenu}
        />
        <WidgetSettingsMenu
          settingsMenuAnimation={settingsMenuAnimation}
          handleCloseSettingsMenu={handleCloseSettingsMenu}
        />
      </div>
    </Box>
  );
}
