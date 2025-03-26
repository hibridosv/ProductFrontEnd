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
  tenant: (tenant: string) => {},
  status: (status: string) => {},
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

  const tenant = useCallback(function (tenant: string) {
    Cookies.set("tenant", tenant);
  }, []);

  const status = useCallback(function (status: string) {
    Cookies.set("status", status);
  }, []);

  const logout = useCallback(function () {
    Cookies.remove("authToken");
    Cookies.remove("remoteUrl");
    Cookies.remove("tenant");
    Cookies.remove("status");
  }, []);

  const value = useMemo(
    () => ({
      login,
      remoteUrl,
      tenant,
      status,
      logout,
    }),
    [login, remoteUrl, tenant, status, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
