import React, { useState, useEffect } from 'react';
import './App.css';
import 'monday-ui-react-core/dist/main.css';
import GoalProgressArea from './components/GoalProgressArea/GoalProgressArea';
import ProgressCardList from './components/ProgressCardList/ProgressCardList';
import Box from 'monday-ui-react-core/dist/Box';
import Button from 'monday-ui-react-core/dist/Button';
import LegendList from './components/LegendList/LegendList';
import MainWidget from './components/MainWidget/MainWidget';
import AdminSetupMenu from './components/AdminSetupMenu/AdminSetupMenu';
import CurrentUserContext from './contexts/CurrentUserContext';
import {
  getCurrentMondayUser,
  getMondayUsers,
  getMondayUserSaveData,
  getMondayFilter,
  getMondayContext,
  saveMondayUserData,
  getMondaySettings,
  setMondaySettings as setRemoteMondaySettings,
  listenForMondayContextChange,
  listenForMondaySettingsChange,
  listenForMondayFilterChange,
  displayMondayConfirmation,
  sendMondayNotification
} from './services/monday';
import mondayDefaultSettings from './data/mondayDefaultSettings';
import userDefaultSettings from './data/userDefaultSettings';

export default function App() {
  // I'm setting the initial state this way for local testing. All of this is overridden in production.
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(userDefaultSettings.value);
  const [mondaySettings, setMondaySettings] = useState({});
  const [mondayFilter, setMondayFilter] = useState('');
  const [mondayContext, setMondayContext] = useState({ theme: 'light' });
  const [configuringMondaySettings, setConfiguringMondaySettings] =
    useState(false);

  useEffect(() => {
    setupUsers();
    setupMondaySettings();
    setupMondayContext();
    setupMondayFilter();
  }, []);

  /**
   * Grabs all the users apart of the current workspace, their IDs, names, and avatar photos, then merges that information with save data from Green Works before saving it all to state.
   */
  async function setupUsers() {
    const mondayUsers = await getMondayUsers();

    let newUsers;

    if (process.env.REACT_APP_DEVELOPMENT_ENVIRONMENT !== 'dev') {
      newUsers = await Promise.all(mondayUsers.map(getMergedUserSaveData));
    } else {
      newUsers = [];

      for (let i = 1; i <= 11; i++) {
        const newUser = Object.assign(userDefaultSettings.value, {
          id: i,
          name: i % 2 === 0 ? 'John Doe' : 'Jain Doe'
        });

        newUsers.push(newUser);
      }

      const testCurrentUser = Object.assign(userDefaultSettings.value, {
        id: -1
      });

      newUsers.push(testCurrentUser);
    }

    const currentMondayUser = await setupCurrentUser(newUsers);
    makeCurrentUserFirstInList(newUsers, currentMondayUser);
    setUsers(newUsers);
  }

  /**
   * Gets the active monday user, updates the currentUser state, and places the active user first in the progress card list.
   */
  async function setupCurrentUser(users) {
    const currentMondayUser = await getCurrentMondayUser();
    let newCurrentMondayUser;
    // Used in testing to find a premade 'current user'.
    if (currentMondayUser?.id)
      newCurrentMondayUser = users.find(
        (user) => user.id === currentMondayUser.id
      );
    else newCurrentMondayUser = users.find((user) => user.id === -1);

    newCurrentMondayUser = Object.assign(
      newCurrentMondayUser,
      currentMondayUser
    );

    setCurrentUser(newCurrentMondayUser);
    return newCurrentMondayUser;
  }

  /**
   * Orders the active user's progress card such that it's the first in the list and easiest to find/interact with.
   */
  function makeCurrentUserFirstInList(users, currentUser) {
    const currentUserIdx = users.findIndex(
      (user) => user.id === currentUser.id
    );
    users.splice(currentUserIdx, 1);
    users.unshift(currentUser);
  }

  /**
   * Combines a user's monday data with the save data specific to Green Works.
   * @param {object} user - An object containing a monday user's name, monday id, and avatar photo.
   * @returns - an object with the user's monday data and Green Works save data (located in monday's storage database) combined.
   */
  async function getMergedUserSaveData(user) {
    const userSaveDataRes = await getMondayUserSaveData(user.id);

    // Replaces the default settings with ones that were fetched from monday.
    const userSaveData = Object.assign(
      userDefaultSettings.value,
      userSaveDataRes
    );
    // Merges the userSaveData and user object, favoring user properties if there are any common keys.
    const mergedUserSaveData = Object.assign(userSaveData, user);

    return mergedUserSaveData;
  }

  /**
   * Sets up the settings listener, as well as grabs the most up-to-date settings from the monday api and sets
   * it as the current state.
   */
  async function setupMondaySettings() {
    const resMondaySettings = await getMondaySettings();

    updateMondaySettings(resMondaySettings);

    listenForMondaySettingsChange(updateMondaySettings);
  }

  /**
   * Updates the local monday settings state and calls the monday api to update it remotely as well.
   * @param {object} newSettings - The most up-to-date monday settings for Green Works.
   */
  async function setMondaySettingsAndRemote(newSettings) {
    const updatedMondaySettings = await setRemoteMondaySettings(newSettings);

    if (newSettings?.checkInReminder) sendGlobalCheckinNotification();

    updateMondaySettings(updatedMondaySettings);
  }

  /**
   * Takes the most up-to-date monday settings for Green Works and updates the current state with them, or uses
   * the default settings if none were provided.
   * @param {object} updatedMondaySettings - An object with all the most up-to-date monday settings for Green Works.
   */
  function updateMondaySettings(updatedMondaySettings) {
    const newMondaySettings = Object.assign(
      mondayDefaultSettings.value,
      updatedMondaySettings
    );

    setMondaySettings(newMondaySettings);
  }

  /**
   * Sends a monday notification (and possibly an email) to all members of the Green Works board.
   */
  async function sendGlobalCheckinNotification() {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      sendMondayNotification(
        "You've been invited to participate in a green initiative!",
        user.id,
        mondayContext.boardId
      );
    }
  }

  /**
   * Sets up the context listener, as well as grabs the most up-to-date context from the monday api and sets
   * it as the current state.
   */
  async function setupMondayContext() {
    const resMondayContext = await getMondayContext();

    updateMondayContext(resMondayContext);

    listenForMondayContextChange(updateMondayContext);
  }

  /**
   * Takes the most up-to-date monday context for Green Works and updates the current state with it, or uses
   * the default context if one wasn't provided.
   * @param {object} updatedMondaySettings - An object with the most up-to-date monday context for Green Works.
   */
  function updateMondayContext(updatedMondayContext) {
    const newMondayContext = Object.assign(
      { theme: 'light' },
      updatedMondayContext
    );

    setMondayContext(newMondayContext);
  }

  /**
   * Gets the current filter settings the user has on monday and sets it as the mondayFilter state, and also
   * sets up a listener for any future changes to update the state.
   */
  async function setupMondayFilter() {
    const resMondayFilter = await getMondayFilter();

    updateMondayFilter(resMondayFilter);

    listenForMondayFilterChange(updateMondayFilter);
  }

  function updateMondayFilter(newFilter) {
    setMondayFilter(newFilter);
  }

  /**
   * A wrapper for updating and saving user data.
   * @param {function} updateCallback - A callback that performs work on the active user's data.
   */
  function updateUser(updateCallback) {
    const userIdx = users.findIndex((user) => user.id === currentUser.id);
    const newUser = { ...users[userIdx] };

    updateCallback(newUser);

    const newUsers = [...users];
    newUsers.splice(userIdx, 1, newUser);
    setUsers(newUsers);
    setCurrentUser(newUser);
    saveMondayUserData(currentUser);
    setMondaySettingsAndRemote({
      teamProgress: (parseInt(mondaySettings.teamProgress) + 1).toString()
    });
  }

  /**
   * Updates the active user's task list.
   * @param {object[]} newTasks - An array of the updated taskList that belongs to a user.
   */
  function updateUserTasks(newTasks) {
    updateUser((newUser) => {
      // Splicing in order to change the underlying tasks array, forcing a state update.
      newUser.tasks.splice(0, newUser.tasks.length, ...newTasks);
    });
  }

  /**
   * Updates the active user's settings list.
   * @param {object[]} newSettings - An array of the updated settings list that belongs to a user.
   */
  function updateUserSettings(newSettings) {
    updateUser((newUser) => {
      // Splicing in order to change the underlying settings array, forcing a state update.
      newUser.settings.splice(0, newUser.settings.length, ...newSettings);
    });
  }

  /**
   * Resets all the Green Works settings on monday, as well as clear all of the tasks that user's have in the board.
   */
  async function resetAll() {
    const confirmation = await displayMondayConfirmation(
      'Are you sure you want to reset Green Works settings and all user tasks? This CANNOT be undone!',
      'Yes',
      'No'
    );

    if (!confirmation) return;

    // Clears all tasks for all users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const newUser = {
        ...user,
        tasks: []
      };

      await saveMondayUserData(newUser);
    }

    setMondaySettingsAndRemote(mondayDefaultSettings.value);

    setConfiguringMondaySettings(false);
  }

  return (
    <div className="App" data-theme={mondayContext.theme}>
      <Box
        className={`main ${configuringMondaySettings ? 'fade-out' : 'fade-in'}`}
      >
        {currentUser.is_admin && (
          <Button
            className="configure"
            onClick={() => setConfiguringMondaySettings(true)}
            kind={Button.kinds.TERTIARY}
            disabled={configuringMondaySettings}
          >
            Modify Board
          </Button>
        )}
        <CurrentUserContext.Provider
          value={{ data: currentUser, updateUserTasks, updateUserSettings }}
        >
          <MainWidget />
          <LegendList />
          <GoalProgressArea mondaySettings={mondaySettings} />
          <ProgressCardList
            users={
              mondayFilter.length > 0
                ? users.filter((user) =>
                    user.name
                      .split(' ')[0]
                      .toLowerCase()
                      .includes(mondayFilter.toLowerCase())
                  )
                : users
            }
            mondaySettings={mondaySettings}
          />
        </CurrentUserContext.Provider>
      </Box>
      <Box
        className={`admin-setup-menu-container ${
          configuringMondaySettings ? 'fade-in' : 'fade-out'
        }`}
      >
        <AdminSetupMenu
          setMondaySettingsAndRemote={setMondaySettingsAndRemote}
          setConfiguringMondaySettings={setConfiguringMondaySettings}
          resetAll={resetAll}
        />
      </Box>
    </div>
  );
}
