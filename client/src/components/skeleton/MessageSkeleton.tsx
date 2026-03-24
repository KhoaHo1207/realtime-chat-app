export default function MessageSkeleton() {
  const skeletonMessages = Array.from({ length: 6 });
  const widths = ["w-[200px]", "w-[160px]", "w-[240px]"];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, index) => {
        const isOwn = index % 2 !== 0;

        return (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              isOwn ? "justify-end flex-row-reverse" : "justify-start"
            }`}
          >
            <div className="size-10 rounded-full bg-gray-300 animate-pulse" />

            <div>
              <div className="h-4 w-16 bg-gray-300 rounded mb-2 animate-pulse" />
              <div
                className={`${
                  widths[index % widths.length]
                } h-16 bg-gray-300 rounded-lg animate-pulse`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
