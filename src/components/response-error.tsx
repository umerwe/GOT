"use client";

import { cn } from "@/lib/utils";

interface ResponseErrorProps {
  error: string;
  className?: string;
}

const ResponseError = ({ className }: ResponseErrorProps) => {
  return (
    <div className={cn("flex items-center justify-center bg-white", className)}>
      <div className="text-center px-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-2">Unable to reach the server</h1>
        <p className="text-gray-400 text-sm mb-1 max-w-[280px] mx-auto leading-relaxed">
          We&apos;re having trouble connecting to our services. This could be due to:
        </p>

        <ul className="text-gray-400 text-sm mb-6 space-y-1">
          <li>• Your internet connection is offline</li>
          <li>• The server is temporarily down</li>
          <li>• Maintenance is currently in progress</li>
        </ul>

        <p className="text-gray-400 text-xs mb-6 max-w-[260px] mx-auto">
          Please check your connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-8 py-2.5 bg-black text-white cursor-pointer text-sm rounded-full hover:opacity-80 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ResponseError;