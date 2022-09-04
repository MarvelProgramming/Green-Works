import React, { useState, useEffect } from 'react';
import './App.css';
import 'monday-ui-react-core/dist/main.css';
import GoalProgressArea from './components/GoalProgressArea/GoalProgressArea';
import ProgressCardList from './components/ProgressCardList/ProgressCardList';
import Box from 'monday-ui-react-core/dist/Box';
import LegendList from './components/LegendList/LegendList';
import MainWidget from './components/MainWidget/MainWidget';
import CurrentUserContext from './contexts/CurrentUserContext';
import {
  getCurrentMondayUserID,
  getMondayUsers,
  getMondayUserSaveData,
  saveMondayUserData
} from './services/monday';

export default function App() {
  // I'm setting the initial state this way for local testing. All of this is overridden in production.
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState({
    id: -1,
    name: '',
    tasks: [],
    settings: [],
    photo_thumb_small: ''
  });
  // TODO: Setup to be confiurable with whatever the group decides on UI wise.
  const [currentGoal, setCurrentGoal] = useState('a four day work week');

  useEffect(() => {
    setupUsers();
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

      for (let i = 1; i <= 100; i++) {
        const newUser = {
          id: i,
          name: i % 2 === 0 ? 'John Doe' : 'Jain Doe',
          photo_thumb_small:
            'https://files.monday.com/use1/photos/33741361/thumb_small/33741361-user_photo_initials_2022_08_29_23_51_13.png?1661817073',
          tasks: [],
          settings: [
            {
              label: 'Disable notifications for 8 hours',
              status: false,
              toggle: false
            },
            {
              label: 'Disable all notifications',
              status: false,
              toggle: false
            }
          ]
        };

        newUsers.push(newUser);
      }

      const testCurrentUser = {
        id: -1,
        name: 'John Doe',
        photo_thumb_small:
          'https://files.monday.com/use1/photos/33741361/thumb_small/33741361-user_photo_initials_2022_08_29_23_51_13.png?1661817073',
        tasks: [],
        settings: [
          {
            label: 'Disable notifications for 8 hours',
            status: false,
            toggle: false
          },
          {
            label: 'Disable all notifications',
            status: false,
            toggle: false
          }
        ]
      };

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
    let currentMondayUserID = await getCurrentMondayUserID();
    let currentMondayUser;

    // Used in testing to find a premade 'current user'.
    if (currentMondayUserID)
      currentMondayUser = users.find((user) => user.id === currentMondayUserID);
    else currentMondayUser = users.find((user) => user.id === -1);

    setCurrentUser(currentMondayUser);
    return currentMondayUser;
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
    const userSaveDataRes = getMondayUserSaveData(user.id);

    const userSaveData = Object.assign(
      {
        tasks: [],
        settings: [
          {
            label: 'Disable notifications for 8 hours',
            status: false,
            toggle: false
          },
          {
            label: 'Disable all notifications',
            status: false,
            toggle: false
          }
        ]
      },
      userSaveDataRes
    );

    return { ...user, ...userSaveData };
  }

  /**
   * Adjusts the amount of fill users see in the goal progress bar.
   */
  function updateGoalProgressBar() {
    // TODO: Progress is determined by how many points a team has accrued, relative to a total point goal. The current implementation
    // takes the average completion percentage between all team members.
    const userCount = users.filter((user) => user.tasks.length > 0).length;
    const userTaskCompletionPercentages = users.map((user) => {
      const totalCompletionPercentage = user.tasks.reduce(
        (completionPercentage, nextTask) =>
          completionPercentage + Math.min(nextTask.status / 7.5, 1),
        0
      );
      return (
        totalCompletionPercentage /
        (user.tasks.length > 0 ? user.tasks.length : 1)
      );
    });
    const totalTaskCompletionPercentage = userTaskCompletionPercentages.reduce(
      (total, nextPercentage) => total + nextPercentage,
      0
    );

    // Ensures the progress bar is never completely empty. Would simply return before the setProgress call,
    // but that causes issues with updating the state of child elements.
    const averageTaskPercentage =
      totalTaskCompletionPercentage / userCount || 0.01;

    setProgress(averageTaskPercentage);
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
    updateGoalProgressBar();
    saveMondayUserData(currentUser);
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

  return (
    <div className="App">
      <Box className="main">
        <CurrentUserContext.Provider
          value={{ data: currentUser, updateUserTasks, updateUserSettings }}
        >
          <MainWidget />
          <LegendList />
          <GoalProgressArea progress={progress} currentGoal={currentGoal} />
          <ProgressCardList
            users={users}
            updateGoalProgressBar={updateGoalProgressBar}
          />
        </CurrentUserContext.Provider>
      </Box>
    </div>
  );
}
