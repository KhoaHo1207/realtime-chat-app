import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../store/slice/chatSlice";
import type { AppDispatch, RootState } from "../store/store";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";

export default function Sidebar() {
  const [showOnlineOnly, setShowOnlineOnly] = useState<boolean>(false);
  const { users, selectedUser, isUsersLoading } = useSelector(
    (state: RootState) => state.chat
  );
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div>
      <aside className="h-full w-28 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-300 bg-white">
        {/* HEADER */}
        <div className="border-b border-gray-200 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6 text-gray-700" />
            <span className="font-medium hidden lg:block text-gray-800">
              Contacts
            </span>
          </div>

          {/* ONLINE ONLY FILTER */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label
              htmlFor="showOnlineOnly"
              className="cursor-pointer flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                id="showOnlineOnly"
                checked={showOnlineOnly}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setShowOnlineOnly(e.target.checked)
                }
                className="size-4 border-gray-700 text-blue-700 focus:ring-blue-500"
              />
              Show Online Only
            </label>
            <span className="text-xs text-green-600">
              ( {onlineUsers.length || 0} )
            </span>
          </div>
        </div>

        {/* USER LIST */}
        <div className="overflow-y-auto w-full py-3 space-y-2 px-2">
          {filteredUsers.length > 0 &&
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md cursor-pointer ${
                  selectedUser?._id === user._id
                    ? "bg-gray-200 ring-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                {/* AVATAR */}
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user?.avatar?.url || "/avatar-holder.avif"}
                    alt={user?.fullName}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) ? (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 rounded-full ring-2 ring-white" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 rounded-full ring-2 ring-white" />
                  )}
                </div>

                {/* USER INFO */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                    {user.fullName}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No Online Users
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
