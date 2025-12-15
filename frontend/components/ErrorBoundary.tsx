'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
    toast.error('Có lỗi xảy ra, vui lòng thử lại');
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h1>
        <p className="text-gray-600 mb-6">{error.message || 'Vui lòng thử lại sau'}</p>
        <button
          onClick={reset}
          className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
