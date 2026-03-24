import { Users } from "lucide-react";

export default function SidebarSkeleton() {
  const skeletonContacts = Array(8).fill(null);
  return (
    <aside className="h-dull w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-300">
      {/* HEADER */}
      <div className="border-b border-gray-200 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-gray-700" />
          <span className="font-medium hidden lg:block text-gray-800">
            Contacts
          </span>
        </div>
      </div>

      {/* SKELETON CONTACTS */}

      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, index) => (
          <div
            key={index}
            className="w-full p-3 flex items-center gap-3 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="size-12 bg-gray-300 rounded-full"></div>
            </div>

            {/* TEXT SKELETON FOR LARGE SCREEN ONLY */}
            <div className="hidden lg:flex flex-col gap-2 flex-1">
              <div className="h-4 w-30 bg-gray-300 rounded" />
              <div className="h-4 w-16 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
