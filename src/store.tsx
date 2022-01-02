import { configureStore } from "@reduxjs/toolkit";
import saveReducer, {
  initialState as saveInitialState,
} from "./slices/saveSlice";
import userReducer, {
  initialState as userInitialState,
} from "./slices/userSlice";
import { mergeObject } from "./utils/merge";
import _ from "lodash";

const persistedState = JSON.parse(localStorage.getItem("BE") || "{}");

const store = configureStore({
  reducer: {
    save: saveReducer,
    user: userReducer,
  },
  preloadedState: mergeObject(persistedState, {
    save: saveInitialState,
    user: userInitialState,
  }),
});

store.subscribe(
  _.throttle(() => {
    localStorage.setItem("BE", JSON.stringify(store.getState()));
  }, 1000)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
