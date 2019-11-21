import React from "react";

export interface AppContextInterface {
  token: string | null;
  userId: string | null;
  login(token: string, userId: string, tokenExpiration: string): void;
  logout(): void;
}

export default React.createContext<AppContextInterface>({
  token: null,
  userId: null,
  login: (token: string, userId: string, tokenExpiration: string) => {},
  logout: () => {}
});
