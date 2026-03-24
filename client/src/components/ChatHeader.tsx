import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { setSelectedUser } from "../store/slice/chatSlice";
import { X } from "lucide-react";

export default function ChatHeader() {
  const { selectedUser } = useSelector((state: RootState) => state.chat);
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="p-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="relative size-10">
            <img
              src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
              alt={selectedUser?.fullName}
              className="size-full object-cover rounded-full"
            />
            {selectedUser?._id && onlineUsers.includes(selectedUser._id) ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white" />
            ) : (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 rounded-full ring-2 ring-white" />
            )}
          </div>
          {/* NAME AND STATUS */}
          <div>
            <h3 className="font-medium text-base text-black">
              {selectedUser?.fullName}
            </h3>
            <p
              className={`text-xs font-medium ${
                selectedUser?._id && onlineUsers.includes(selectedUser._id)
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {selectedUser?._id && onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => dispatch(setSelectedUser(null))}
          className="text-gray-800 hover:text-black transition"
        >
          <X className="size-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
