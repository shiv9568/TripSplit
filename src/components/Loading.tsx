import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return <Loader2 className={`animate-spin text-indigo-600 ${className}`} size={size} />;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={40} />
        <p className="text-gray-500 mt-3">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
        <LoadingSpinner size={32} />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
