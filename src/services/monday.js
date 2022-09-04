import mondaySdk from 'monday-sdk-js';
const monday = mondaySdk();

/**
 * Makes a call to the monday api to grab and return the active user's id.
 * @returns A number that uniquely identifies the current monday user.
 */
export async function getCurrentMondayUserID() {
  try {
    const res = await monday.api(`query { me { id } }`);

    const currentMondayUser = res.data.me.id;

    return currentMondayUser;
  } catch (err) {
    console.log("Couldn't find the current monday user! Returned: null\n", err);
    return null;
  }
}

/**
 * Makes a call to the monday api to grab and return all of the users belonging to the active workspace.
 * @returns An array of all users belonging to the active workspace, or an empty array if they couldn't be found.
 */
export async function getMondayUsers() {
  try {
    const res = await monday.api(
      `query { users { id, name, photo_thumb_small } }`
    );

    const mondayUsers = res.data.users;

    return mondayUsers;
  } catch (err) {
    console.log("Couldn't find monday users! Returned: []\n", err);
    return [];
  }
}

/**
 * Makes a call to the monday api to grab Green Works save data belonging to a specific user from the storage database.
 * @param {number} userID - A number that uniquely identifies a monday user.
 * @returns - The Green Works save data belonging to the user with the assigned userID, or null if the user couldn't be found.
 */
export async function getMondayUserSaveData(userID) {
  try {
    const res = await monday.storage.instance.getItem(userID);

    const userSaveData = JSON.parse(res.data.value);

    return userSaveData;
  } catch (err) {
    console.log("Couldn't find user save data! Returned: null\n", err);
    return null;
  }
}

/**
 * Makes a call to the monday api to store the user's information using the storage database.
 * @param {object} user - The user who's information is being saved.
 * @param {number} user.id - The unique identifier assigned to the user by monday.
 * @param {string} user.name - The user's full name.
 * @param {string} user.photo_thumb_small - A link to the user's avatar photo, as seen on monday.
 * @param {object[]} user.tasks - An array of all the tasks assigned to the user.
 * @param {object[]} user.settings - An array of the locally configured Green Works settings belonging to the user.
 */
export async function saveMondayUserData(user) {
  const userID = user.id;

  try {
    const userData = JSON.stringify(user);

    monday.storage.instance.setItem(userID, userData);
  } catch (err) {
    console.log(`Failed to save user(${userID})\'s information!\n`, err);
  }
}
