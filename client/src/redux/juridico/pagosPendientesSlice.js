import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const JURIDICO_URLS = "http://localhost:3000/api/pagosData";

const initialState = {
  pagosLists: [],
  status: "idle",
  error: null,
};

export const fetchPagosLists = createAsyncThunk("pagosLists/fetchPagosLists", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
   // return [...response.data];
    return response.data;
  } catch (error) {
    return error.message;
  }
});

export const forceUpdatePagosLists = createAsyncThunk("pagosLists/forceUpdatePagosLists", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

export const pagosListSlice = createSlice({
  name: "pagosLists",
  initialState,
  reducers: {
    pagosListAdded: {
      reducer(state, action) {
        state.pagosLists.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { pagosListId, reaction } = action.payload;
      const existingPagosList = state.pagosLists.find((pagosList) => pagosList.id === pagosListId);
      if (existingPagosList) {
        existingPagosList.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPagosLists.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPagosLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pagosLists = action.payload;
      })
      .addCase(fetchPagosLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(forceUpdatePagosLists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forceUpdatePagosLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pagosLists = action.payload;
      })
      .addCase(forceUpdatePagosLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllPagosLists = (state) => state.pagosLists.pagosLists;
export const getPagosListsStatus = (state) => state.pagosLists.status;
export const getPagosListsErrors = (state) => state.pagosLists.error;
export const { pagosListAdded, reactionAdded } = pagosListSlice.actions;
export default pagosListSlice.reducer;
