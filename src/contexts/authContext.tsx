"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import Cookies from "js-cookie";


export const AuthContext = createContext({
  login: (authToken: string) => {},
  remoteUrl: (url: string) => {},
  logout: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {


  const login = useCallback(function (authToken: string) {
    Cookies.set("authToken", authToken);
  }, []);

  const remoteUrl = useCallback(function (url: string) {
    Cookies.set("remoteUrl", url);
  }, []);

  const logout = useCallback(function () {
    Cookies.remove("authToken");
    Cookies.remove("remoteUrl");
  }, []);

  const value = useMemo(
    () => ({
      login,
      remoteUrl,
      logout,
    }),
    [login, remoteUrl, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
