import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { getUser, setOnlineUsers } from "./store/slice/authSlice";
import type { AppDispatch, RootState } from "./store/store";
import Loader from "./components/skeleton/Loader";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
function App() {
  const { authUser, isCheckingAuth } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch, getUser]);

  useEffect(() => {
    if (authUser) {
      const socket = connectSocket(authUser._id);

      socket.on("getOnlineUsers", (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
