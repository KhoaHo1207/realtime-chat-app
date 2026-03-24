import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import type { AppDispatch, RootState } from "../store/store";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User } from "lucide-react";
import { logout } from "../store/slice/authSlice";

export default function Navbar() {
  const { authUser, onlineUsers } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const isOnline = authUser?._id && onlineUsers.includes(authUser?._id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:scale-105 transition"
        >
          <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <MessageSquare className="size-5 text-blue-600" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">
            Talkie
          </h1>
        </Link>

        {authUser && (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="relative">
                <img
                  src={authUser?.avatar?.url || "/avatar-holder.avif"}
                  alt={authUser?.fullName}
                  className="size-9 sm:size-10 object-cover rounded-full border border-gray-200"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                    isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              </div>

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-sm font-medium text-gray-800">
                  {authUser?.fullName}
                </span>
                <span className="text-xs text-gray-500">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <User className="size-4" />
                  View Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
