import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User } from "lucide-react";
import { logout } from "../store/slice/authSlice";
export default function Navbar() {
  const { authUser } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* LEFT LOGO */}
          <div className="flex items-center gap-8">
            <Link
              to={"/"}
              className="flex items-center gap-2.5 hover:opacity-0 transition"
            >
              <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="size-5 text-blue-600" />
              </div>

              <h1 className="text-lg font-bold text-gray-800">Talkie</h1>
            </Link>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {authUser && (
              <>
                <Link
                  to={`/profile`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <User className="w-5 h-6" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-700 hover:bg-gray-100 transition"
                >
                  <LogOut className="w-5 h-6" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
