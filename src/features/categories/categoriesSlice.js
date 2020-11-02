import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories } from "../../api/client";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const res = await getCategories();
    return res;
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: {
    [fetchCategories.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchCategories.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.categories = state.categories.concat(action.payload);
    },
    [fetchCategories.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    }
  }
});

export const categories = state => state.categories.categories;

export default categoriesSlice.reducer;
