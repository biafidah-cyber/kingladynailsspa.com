export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-full w-48 mb-4 mx-auto" />
      <div className="h-4 bg-gray-100 rounded-full w-80 mb-12 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="h-44 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-3 bg-gray-200 rounded-full w-24" />
              <div className="h-4 bg-gray-200 rounded-full w-full" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-full" />
              <div className="h-3 bg-gray-100 rounded-full w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
