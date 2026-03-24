export const formatMessageTime = (date: string | number | Date): string => {
  const d = new Date(date);

  return isNaN(d.getTime())
    ? "--:--"
    : d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
};
