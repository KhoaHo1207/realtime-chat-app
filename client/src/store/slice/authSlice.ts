import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import type { LoginFormData, User } from "../../types";
import type { RegisterFormData } from "./../../types";

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
  isCheckingAuth: true,
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
      await axiosInstance.get("/auth/sign-out");
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
      return response.data.results.user;
    } catch (error) {
      console.log("Error logging in", error);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to login");
      return rejectWithValue(err.response?.data?.message || "Failed to login");
    }
  }
);

export const register = createAsyncThunk(
  "user/sign-up",
  async (formData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("auth/sign-up", formData);
      toast.success(response.data.message || "Registered successfully");
      return response.data.results.user;
    } catch (error) {
      console.log("Error registering", error);
      const err = error as AxiosError<{ message: string }>;

      toast.error(err.response?.data?.message || "Failed to register");
      return rejectWithValue(
        err.response?.data?.message || "Failed to register"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/update-profile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/user/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Profile updated successfully");
      return response.data.results.user;
    } catch (error) {
      console.log("Error updating profile", error);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update profile");
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile"
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
        state.authUser = null;
        state.isCheckingAuth = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.pending, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload as User | null;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.isSigningUp = false;
      })
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = {
          ...state.authUser,
          ...action.payload,
        };
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
