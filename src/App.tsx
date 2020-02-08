import { ApolloProvider } from "@apollo/react-hooks";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from "apollo-boost";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import AuthContext from "./context/auth-context";
import Login from "./pages/login/Login";
import Meetups from "./pages/meetups/Meetups";
import Register from "./pages/register/register";
import Speakers from "./pages/speakers/Speakers";
import Users from "./pages/users/Users";

const httpLink = new HttpLink({ uri: "http://localhost:8000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("auth_token");

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const App: React.FC = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();

  const login = (token: string, userId: string, tokenExpiration: string) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem("auth_token", token);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("auth_token");
  };

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    if (auth_token) {
      setToken(auth_token);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            login: login,
            logout: logout,
            token: token,
            userId: userId
          }}
        >
          <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/speakers" component={Speakers} exact />
            <Route path="/meetups" component={Meetups} exact />
            <Route path="/users" component={Users} exact />
            <Redirect from="/login" to="/meetups" exact />
            <Redirect from="/register" to="/meetups" exact />
            <Redirect from="*" to="/login" exact />
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
