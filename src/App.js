import React from "react";

import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';

import { Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";

import { MainLayout } from "./layouts";

import Organization from "./pages/Organization";
import User from "./pages/User";
import EditOrganization from './pages/Organization/EditOrganization';
import EditUser from './pages/User/EditUser';
import theme from "./theme";

import "./App.scss";

Amplify.configure(awsConfig);

const renderWithLayout = (Component, Layout) => <Layout>{Component}</Layout>;

const App = ({ history }) => (
  <ThemeProvider theme={theme}>
    <Router history={history}>
      <Switch>
        <Route
          path="/"
          exact
          render={() => renderWithLayout(<Organization />, MainLayout)}
        />
        <Route
          path="/users"
          exact
          render={() => renderWithLayout(<User />, MainLayout)}
        />
        <Route
          path="/editOrganization/:id"
          exact
          render={props => renderWithLayout(<EditOrganization {...props}/>, MainLayout)}
        />
        <Route
          path="/editUser/:id"
          exact
          render={props => renderWithLayout(<EditUser {...props}/>, MainLayout)}
        />
      </Switch>
    </Router>
  </ThemeProvider>
);

export default withAuthenticator(App, false);
