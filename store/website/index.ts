import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routes: {},
  alert: {},
};

export const { actions: websiteActions, reducer: websiteReducer } = createSlice(
  {
    name: "website",
    initialState,
    reducers: {
      setRoutes: (state: any, { payload }) => {                        
        state.routes = payload;
         
      },
      setAlertData: (state, { payload }) => {
        state.alert = payload;
      },
    },
  }
);
