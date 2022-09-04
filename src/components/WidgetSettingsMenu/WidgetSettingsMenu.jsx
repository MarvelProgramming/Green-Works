import React from 'react';
import './styling.css';
import MenuModal from '../MenuModal/MenuModal';
import Toggle from 'monday-ui-react-core/dist/Toggle';
import useCurrentUser from '../../hooks/useCurrentUser';

export default function WidgetSettingsMenu({
  settingsMenuAnimation,
  handleCloseSettingsMenu
}) {
  const currentUser = useCurrentUser();

  /**
   * Sets the toggle states to the value of their respective status', starts fading animations, and closes the menu.
   * @param {boolean} openTasksMenu - A flag for whether the tasks menu should open when the settings menu closes.
   */
  function handleClose(openTasksMenu = true) {
    handleCloseSettingsMenu(openTasksMenu);

    const newUserSettings = currentUser.data.settings.map((setting) => ({
      ...setting,
      toggle: setting.status
    }));

    currentUser.updateUserSettings(newUserSettings);
  }

  /**
   * Updates the active user's Green Works setting.
   * @param {boolean} newState - A true/false value that represents whether the setting is enabled or disabled, respectively.
   * @param {number} idx - The index belonging to the setting toggle that raised this event.
   */
  function handleSettingChange(newState, idx) {
    const newUserSettings = [...currentUser.data.settings];
    newUserSettings[idx].toggle = newState;
    currentUser.updateUserSettings(newUserSettings);
  }

  /**
   * Sets the status for each of the active user's Green Works settings to the value of their respective 'toggle' state.
   */
  function handleSubmit() {
    const newUserSettings = currentUser.data.settings.map((setting) => ({
      ...setting,
      status: setting.toggle
    }));

    currentUser.updateUserSettings(newUserSettings);
    handleClose();
  }

  return (
    <MenuModal
      className={settingsMenuAnimation}
      title="Settings"
      overrideSubmitText="Save"
      handleClose={handleClose}
      handleSubmit={handleSubmit}
    >
      {currentUser.data.settings.map((setting, idx) => (
        <Toggle
          key={idx}
          className="toggle"
          offOverrideText=""
          onOverrideText={setting.label}
          isSelected={setting.toggle}
          onChange={(newState) => handleSettingChange(newState, idx)}
        />
      ))}
    </MenuModal>
  );
}
