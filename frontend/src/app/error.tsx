"use client";

import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="text-center">
        <p className="font-display text-8xl font-800 text-red-500/20">!</p>
        <h1 className="mt-4 font-display text-2xl font-800 tracking-[-0.03em]">Something went wrong</h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
