import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      role="alert"
      className="p-6 max-w-xl mx-auto mt-8 rounded-lg border border-red-200 bg-red-50"
    >
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Something went wrong
      </h2>
      <div className="text-gray-700 mb-4">
        <p className="mb-2">An error occurred:</p>
        <pre className="bg-red-100 p-3 rounded text-sm overflow-auto">
          {error.message}
        </pre>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};
