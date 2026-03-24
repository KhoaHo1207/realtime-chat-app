import { useEffect, useState } from "react";
import Loader from "../components/skeleton/Loader";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { updateProfile } from "../store/slice/authSlice";

export default function Profile() {
  const { authUser, isUpdatingProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authUser) return;

    setFormState({
      fullName: authUser.fullName || "",
      email: authUser.email || "",
    });
    setAvatarPreview(authUser.avatar?.url || null);
    setAvatarFile(null);
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("fullName", formState.fullName.trim());
    data.append("email", formState.email.trim());
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }
    dispatch(updateProfile(data));
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-blue-500 to-blue-700 text-white px-6 py-8">
            <h1 className="text-3xl font-semibold">Your Profile</h1>
            <p className="text-sm text-blue-100 mt-1">
              Keep your information up to date so your friends can recognize
              you.
            </p>
          </div>
          <div className="flex flex-col gap-8 p-6 lg:flex-row lg:gap-10">
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Avatar
                </p>
                <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex flex-col gap-4 items-center text-center">
                  <div className="flex items-center gap-3">
                    <div className="size-20 rounded-full overflow-hidden border border-gray-200">
                      <img
                        src={avatarPreview || "/avatar-holder.avif"}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-gray-700">
                        Update your avatar
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, or GIF up to 5MB.
                      </p>
                    </div>
                  </div>
                  <label className="inline-flex items-center justify-center rounded-full border border-blue-500 text-blue-500 px-4 py-2 text-sm font-medium cursor-pointer hover:bg-blue-50 transition">
                    Choose file
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  {(avatarPreview || avatarFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove selected avatar
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  About
                </p>
                <p className="text-sm text-gray-600">
                  Add a short bio in the future to let your friends know what
                  you are up to.
                </p>
              </div>
            </div>

            <div className="flex-1">
              <form className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Full name
                  </label>
                  <input
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Preferences
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    We will let you manage notification preferences soon.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader className="size-4 text-white animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
