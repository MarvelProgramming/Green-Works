/**
 * Unpacks the player's first name and returns it.
 * @param {{ name : string }} user - The user who's first name we're looking to get.
 * @returns The user's first name.
 */
export default function useFirstName(user) {
  const [firstName] = user.name.split(' ');

  return firstName;
}
