import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

export default function Home() {
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const { authUser } = useSelector((state: RootState) => state.auth);

  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
