export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">🎡</div>
        <p className="text-white text-xl font-bold">Loading LuckyRoom...</p>
      </div>
    </div>
  );
}
