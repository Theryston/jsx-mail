'use client';

import axios from '@/app/utils/axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from './types';
import { Crisp } from 'crisp-sdk-web';

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
  const [user, setUser] = useState<User>({
    ...userProp,
    birthdate: userProp.birthdate ? new Date(userProp.birthdate) : null,
  });

  const fetchUser = useCallback(async () => {
    const { data } = await axios.get('/user/me');

    setUser({
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate) : null,
    });
  }, []);

  useEffect(() => {
    if (user?.name) Crisp.user.setNickname(user.name);
    if (user?.email) Crisp.user.setEmail(user.email);
    if (user?.phone) Crisp.user.setPhone(user.phone);
  }, [user]);

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
