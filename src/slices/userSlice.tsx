import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customAxios } from "../constants";

export interface IUserSlice {
  loggedIn: boolean;
  name?: string;
  id?: string;
  avatar?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialState = {
  loggedIn: false,
  status: "idle",
  error: null,
} as IUserSlice;

export const checkLoggedIn = createAsyncThunk(
  "user/checkLoggedIn",
  async (_, { rejectWithValue }) => {
    try {
      const response = await customAxios.get("/api/auth/test");
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkLoggedIn.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkLoggedIn.fulfilled, (state) => {
        state.status = "succeeded";
        state.loggedIn = true;
      })
      .addCase(checkLoggedIn.rejected, (state) => {
        state.status = "failed";
        state.loggedIn = false;
      });
  },
});

// export const {} = userSlice.actions;

export default userSlice.reducer;
