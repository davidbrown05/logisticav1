import { configureStore } from "@reduxjs/toolkit";
import juridicoReducer from "../redux/juridico/juridicoSlice";
import postsReducer from '../redux/juridico/postSlice';

export const juridicoStore = configureStore({
  reducer: {
   // juridico: juridicoReducer,
    posts: postsReducer,
  },
});


