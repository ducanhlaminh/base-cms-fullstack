import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import authReducer from "./reducers/authReducer";
import uiReducer from "./reducers/uiReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
