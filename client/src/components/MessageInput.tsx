import { Image, SendHorizonal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSocket } from "../lib/socket";
import type { AppDispatch, RootState } from "../store/store";
import type { Message } from "../types";
import { sendMessage } from "../store/slice/chatSlice";

export default function MessageInput({ receiverId }: { receiverId: string }) {
  const [text, setText] = useState<string>("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser, isSendingMessage } = useSelector(
    (state: RootState) => state.chat
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMedia(file);
    const type = file.type;

    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    } else {
      toast.error("Please select an image or video file");
      setMedia(null);
      setMediaType("");
      setMediaPreview(null);
      return;
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaType("");
    setMediaPreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !media) {
      toast.error("Please enter a message or select a media");
      return;
    }

    const data = new FormData();
    const trimmedText = text.trim();

    if (trimmedText) data.append("text", trimmedText);
    if (media) data.append("media", media);
    dispatch(
      sendMessage({
        receiverId,
        data: data,
      })
    );

    setText("");
    setMedia(null);
    setMediaType("");
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!selectedUser?._id) return;
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        dispatch({
          type: "chat/pushNewMessage",
          payload: newMessage,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedUser?._id, dispatch]);
  return (
    <div className="p-4 w-full">
      {mediaPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Media Preview"
                className="size-20 object-cover rounded-lg border border-gray-700"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="size-20 object-cover rounded-lg border border-gray-700"
              />
            )}
            <button
              onClick={removeMedia}
              type="button"
              className="absolute -top-2 right-2 size-5 bg-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-black"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type your message...."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*, video/*"
            onChange={handleChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            className={`hidden sm:flex items-center justify-center size-10 rounded-full border border-gray-300 hover:border-gray-100 transition cursor-pointer ${
              media ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="size-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          disabled={(!text.trim() && !media) || isSendingMessage}
        >
          <SendHorizonal size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
}
