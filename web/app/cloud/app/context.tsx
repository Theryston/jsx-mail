'use client';

import axios from '@/app/utils/axios';
import { createContext, useCallback, useContext, useState } from 'react';
import { User } from './types';

type CloudAppContextType = {
  user: User;
  fetchUser: () => Promise<void>;
};

const CloudAppContext = createContext({} as CloudAppContextType);

type CloudAppContextProviderProps = {
  children: React.ReactNode;
  user: User;
};

export const CloudAppContextProvider = ({
  children,
  user: userProp,
}: CloudAppContextProviderProps) => {
  const [user, setUser] = useState<User>(userProp);

  const fetchUser = useCallback(async () => {
    const { data } = await axios.get('/user/me');
    setUser(data);
  }, []);

  return (
    <CloudAppContext.Provider
      value={{
        user,
        fetchUser,
      }}
    >
      {children}
    </CloudAppContext.Provider>
  );
};

export const useCloudAppContext = () => useContext(CloudAppContext);
