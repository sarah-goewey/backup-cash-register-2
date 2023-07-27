import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import auth from "./auth";
import transactions from "./transactions";
import items from "./items";

const reducer = combineReducers({
  auth,
  transactions,
  items,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from "./auth";
export * from "./transactions";
export * from "./items";
