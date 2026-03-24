import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import type { Message, User } from "../../types";
import { toast } from "react-toastify";

interface ChatState {
  users: User[];
  selectedUser: User | null;
  messages: Message[];
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
}

const initialState: ChatState = {
  users: [],
  selectedUser: null,
  messages: [],
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
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

export const getMessages = createAsyncThunk(
  "chat/getMessages",
  async (receiverId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/message/${receiverId}`);
      return response.data.results.messages;
    } catch (error) {
      console.log("Error fetching messages", error);
      toast.error("Failed to fetch messages");
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { receiverId, data }: { receiverId: string; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/message/send/${receiverId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Message sent successfully");
      return response.data.results.message;
    } catch (error) {
      console.log("Error sending message", error);
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to send message");
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message"
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

  extraReducers: (builder) =>
    builder
      .addCase(getUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isUsersLoading = false;
      })
      .addCase(getMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        state.messages.push(action.payload as Message);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isSendingMessage = false;
      }),
});
export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
