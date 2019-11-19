import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import Login from "./pages/login/Login";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql"
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
