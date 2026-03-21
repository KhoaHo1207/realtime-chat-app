import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import type { User } from "../../types";

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
}

const initialState: AuthState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  onlineUsers: [],
};

export const getUser = createAsyncThunk(
  "user/me",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data.results.user;
    } catch (error) {
      console.log("Error fetching user", error);
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isCheckingAuth = false;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
