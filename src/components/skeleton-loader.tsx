export const SkeletonLoader = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 rounded bg-gray-300"></div>
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-300"></div>
      </div>
      <div className="p-4">
        <div className="mb-4 h-6 w-3/4 rounded bg-gray-300"></div>
        <div className="mb-3 flex items-center">
          <div className="mr-2 h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-20 rounded bg-gray-300"></div>
        </div>
        <div className="mb-3 flex items-center">
          <div className="mr-2 h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 rounded bg-gray-300"></div>
        </div>
        <div className="mb-4 flex flex-wrap items-center">
          <div className="mr-2 h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="flex flex-wrap">
            <div className="mr-1 mb-1 h-6 w-16 rounded bg-gray-300"></div>
            <div className="mr-1 mb-1 h-6 w-16 rounded bg-gray-300"></div>
            <div className="mr-1 mb-1 h-6 w-16 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex space-x-2">
          <div className="h-6 w-6 rounded bg-gray-300"></div>
          <div className="h-6 w-6 rounded bg-gray-300"></div>
        </div>
        <div className="h-6 w-6 rounded bg-gray-300"></div>
      </div>
    </div>
  )
}
