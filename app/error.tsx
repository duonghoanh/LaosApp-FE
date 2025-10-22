"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
