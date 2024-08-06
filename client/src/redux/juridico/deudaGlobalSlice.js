import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const JURIDICO_URLS = "http://localhost:3000/api/propertyDeudaData";

const initialState = {
  lists: [],
  status: "idle",
  error: null,
};

export const fetchLists = createAsyncThunk("lists/fetchLists", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

export const forceUpdateLists = createAsyncThunk("lists/forceUpdateLists", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    listAdded: {
      reducer(state, action) {
        state.lists.push(action.payload);
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
      const { listId, reaction } = action.payload;
      const existingList = state.lists.find((list) => list.id === listId);
      if (existingList) {
        existingList.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLists.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(forceUpdateLists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forceUpdateLists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lists = action.payload;
      })
      .addCase(forceUpdateLists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllLists = (state) => state.lists.lists;
export const getListsStatus = (state) => state.lists.status;
export const getListsErrors = (state) => state.lists.error;
export const { listAdded, reactionAdded } = listSlice.actions;
export default listSlice.reducer;
