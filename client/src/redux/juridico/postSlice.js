import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const POST_URLS = "https://jsonplaceholder.typicode.com/posts";
const JURIDICO_URLS = "http://localhost:3000/api/juridicoData";

const initialState = {
  posts: [],
  status: "idle",
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

// Nueva acción para forzar la actualización de los datos
export const forceUpdatePosts = createAsyncThunk("posts/forceUpdatePosts", async () => {
  try {
    const response = await axios.get(JURIDICO_URLS);
    return response.data;
  } catch (error) {
    throw error.message;
  }
});

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
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
              cofee: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // adding date and reactions
        // const loadedPosts = action.payload.map((post) => {
        //   post.reactions = {
        //     thumbsUp: 0,
        //     wow: 0,
        //     heart: 0,
        //     rocket: 0,
        //     cofee: 0,
        //   };
        //   return post;
        // });
        // // add any fetched posts to the array
        // state.posts = state.posts.concat(loadedPosts);
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(forceUpdatePosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(forceUpdatePosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(forceUpdatePosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsErrors = (state) => state.posts.error;
export const { postAdded, reactionAdded } = postSlice.actions;
export default postSlice.reducer;