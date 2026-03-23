import { useState } from "react";
import type { RegisterFormData } from "../types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import AuthImagePattern from "../components/AuthImagePattern";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { register } from "../store/slice/authSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
  });

  const { isSigningUp } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { confirmPassword, ...rest } = formData;
    if (formData.password !== confirmPassword) {
      toast.error("Password does not match");
      return;
    }

    dispatch(register(rest));

    setFormData({
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    });
    navigate("/login");
  };
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT SIDE FORM */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* LOGO & HEADING */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="text-blue-600 w-6 h-6" />
            </div>

            <h1 className="text-2xl font-bold mt-4">Welcome!</h1>
            <p className="text-gray-500 text-sm mt-2">
              Create an account to continue your conversation and catch up with
              your messages.
            </p>
          </div>

          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2
                 text-gray-400"
                >
                  <User className="size-5" />
                </span>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  disabled={isSigningUp}
                />
              </div>
            </div>
            <div className="">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2
                 text-gray-400"
                >
                  <Mail className="size-5" />
                </span>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isSigningUp}
                />
              </div>
            </div>

            <div className="">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2
                 text-gray-400"
                >
                  <Lock className="size-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isSigningUp}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 cursor-pointer" />
                  ) : (
                    <Eye className="size-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div className="">
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2
                 text-gray-400"
                >
                  <Lock className="size-5" />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isSigningUp}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5 cursor-pointer" />
                  ) : (
                    <Eye className="size-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account? {""}
              <Link
                to={"/login"}
                className="text-blue-600 hover:underline font-medium"
              >
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PATTERN */}
      <AuthImagePattern
        title="Create an account!"
        subTitle="Create an account to continue your conversation and catch up with your messages."
      />
    </div>
  );
}
