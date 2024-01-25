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

  const logout = useCallback(function () {
    Cookies.remove("authToken");
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
    }),
    [login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
