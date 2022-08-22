import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  authState: boolean;
  authToken: string;
  authUser: any;
}

const initialState: AuthState = {
  authState: false,
  authToken: "",
  authUser: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      return { state, ...action.payload };
    },
  },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;

export default authSlice.reducer;
