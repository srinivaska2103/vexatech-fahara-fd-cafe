export default function Loading() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      <div className="h-10 w-64 bg-surface rounded-xl animate-pulse" />
      <div className="h-6 w-96 bg-surface rounded-md animate-pulse" />
      
      <div className="h-16 w-full bg-surface rounded-2xl animate-pulse mt-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className="h-[380px] w-full bg-surface rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
