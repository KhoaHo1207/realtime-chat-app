import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef } from "react";
import { getMessages } from "../store/slice/chatSlice";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { getSocket } from "../lib/socket";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../utils/formatter";

export default function ChatContainer() {
  const { isMessagesLoading, messages, selectedUser } = useSelector(
    (state: RootState) => state.chat
  );
  const { authUser } = useSelector((state: RootState) => state.auth);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!selectedUser?._id) return;

    dispatch(getMessages(selectedUser?._id));

    const socket = getSocket();

    if (!socket) return;
  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef && messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {messages.length > 0 &&
          messages.map((message, index) => {
            const isSender = message.senderId === authUser?._id;
            return (
              <div
                key={message._id}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                ref={index === messages.length - 1 ? messageEndRef : null}
              >
                {/* AVATAR */}
                <div
                  className={`size-10 rounded-full overflow-hidden border shrink-0 ${
                    isSender ? "order-2 ml-3" : "order-1 mr-3"
                  }`}
                >
                  <img
                    src={
                      isSender
                        ? authUser?.avatar?.url
                        : selectedUser?.avatar?.url || "/avatar-holder.avif"
                    }
                    alt={isSender ? authUser?.fullName : selectedUser?.fullName}
                    className="size-full object-cover"
                  />
                </div>

                {/* BUBBLE */}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm ${
                    isSender
                      ? "bg-blue-600/20 text-black order-1"
                      : "bg-gray-200 text-black order-2"
                  }`}
                >
                  {message.media && (
                    <>
                      {message.media.includes(".mp4") ||
                      message.media.includes(".webm") ||
                      message.media.includes(".mov") ? (
                        <video
                          src={message.media}
                          controls
                          className="w-full rounded-md mb-2"
                        ></video>
                      ) : (
                        <img
                          src={message.media}
                          alt="Attachement"
                          className="w-full rounded-md mb-2"
                        />
                      )}
                    </>
                  )}

                  {message.text && <p>{message.text}</p>}

                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
