import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import type { User } from "../../types";

interface ChatState {
  users: User[];
  selectedUser: User | null;
  messages: string[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
}

const initialState: ChatState = {
  users: [],
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
};

export const getUsers = createAsyncThunk(
  "chat/getUsers",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/message/all-users");
      return response.data.results.users;
    } catch (error) {
      console.log("Error fetching users", error);
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    pushNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.isUsersLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.isUsersLoading = false;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.isUsersLoading = false;
    });
  },
});
export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
