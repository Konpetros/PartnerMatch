import { useState, useEffect } from 'react';
import { subscribeToUsers } from '../services/firebase/firestore';

export const useUsers = (isAdmin: boolean) => {
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setUsersLoading(false);
      return;
    }

    const unsubscribe = subscribeToUsers((users) => {
      setAdminUsers(users);
      setUsersLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  return { adminUsers, usersLoading };
};
