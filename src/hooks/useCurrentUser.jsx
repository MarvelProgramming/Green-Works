import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

export default function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext);
  return currentUser;
}
