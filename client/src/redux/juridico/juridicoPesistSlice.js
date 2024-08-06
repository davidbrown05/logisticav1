import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentJuridico: null,
  error: null,
  loading: false,
};

const juridicoSlice = createSlice({
  name: "juridico",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },

    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signOutUserFailure,signOutUserSuccess,signOutUserStart } = userSlice.actions;
export default userSlice.reducer;