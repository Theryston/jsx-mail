'use client';

import axios from '@/utils/axios';
import { createContext, useCallback, useContext, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  accessLevel: string;
  phone: string | null;
  isPhoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type CloudAppContextType = {
  user: User | null;
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
    const { data } = await axios.get('/user/me', {
      headers: {
        'Force-Auth': 'true',
      },
    });
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
