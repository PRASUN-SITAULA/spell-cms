import type { FallbackProps } from 'react-error-boundary'

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      role="alert"
      className="mx-auto mt-8 max-w-xl rounded-lg border border-red-200 bg-red-50 p-6"
    >
      <h2 className="mb-4 text-xl font-semibold text-red-600">
        Something went wrong
      </h2>
      <div className="mb-4 text-gray-700">
        <p className="mb-2">An error occurred:</p>
        <pre className="overflow-auto rounded bg-red-100 p-3 text-sm">
          {error.message}
        </pre>
      </div>
      <button
        onClick={resetErrorBoundary}
        className="rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  )
}
