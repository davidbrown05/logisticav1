import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const POST_URLS = "http://localhost:3000/api/juridicoData";
//const POST_URLS = "https://jsonplaceholder.typicode.com/posts";

const initialState = {
  juridico: [],
  status: "idle",
  error: null,
};

// Thunk para obtener datos jurídicos desde el servidor
export const fetchData = createAsyncThunk("juridico/fetchData", async () => {
  try {
    const response = await axios.get(POST_URLS);
    return [...response.data];
  } catch (error) {
    throw Error(error.message);
  }
});

export const juridicoSlice = createSlice({
  name: "juridico",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
        console.log("Estado de Redux: cargando");
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.juridico = action.payload;
        console.log("Estado de Redux: éxito");
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.log("Estado de Redux: fallido, error:", state.error);
      });
  },
});

export const selectAllJuridico = (state) => state.juridico;
export const getJuridicoStatus = (state) => state.status;
export const getJuridicoErrors = (state) => state.error;

export default juridicoSlice.reducer;
