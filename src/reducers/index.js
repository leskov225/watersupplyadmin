import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appReducer from '../actions/app';
import orgsReducer from '../actions/orgs';
import usersReducer from '../actions/users';
import loadingReducer from '../actions/loading';

export const rootReducer = asyncReducers => {
  const reducers = {
    router: routerReducer,
    app: appReducer,
    orgs: orgsReducer,
    users: usersReducer,
    loading: loadingReducer,
    ...asyncReducers
  };
  return combineReducers(reducers);
};

export default rootReducer;