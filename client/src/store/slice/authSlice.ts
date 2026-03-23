import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import type { LoginFormData, User } from "../../types";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { toast } from "react-toastify";

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

export const logout = createAsyncThunk(
  "user/sign-out",
  async (_: void, { rejectWithValue }) => {
    try {
      await axiosInstance.get("/user/sign-out");
      disconnectSocket();
      return null;
    } catch (error) {
      console.log("Error logging out", error);

      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to logout");
    }
  }
);

export const login = createAsyncThunk(
  "user/sign-in",
  async (formData: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/sign-in", formData);
      connectSocket(response.data.results.user._id as string);
      toast.success(response.data.message || "Logged in successfully");
      return null;
    } catch (error) {
      console.log("Error logging in", error);
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(err.response?.data?.message || "Failed to login");
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
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.pending, (state) => {
        state.authUser = state.authUser || null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = state.authUser || null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoggingIn = false;
        state.authUser = state.authUser || null;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload as User | null;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
