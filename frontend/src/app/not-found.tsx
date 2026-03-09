import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="text-center">
        <p className="font-display text-8xl font-800 text-primary/20">404</p>
        <h1 className="mt-4 font-display text-2xl font-800 tracking-[-0.03em]">Page Not Found</h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Go Home</Button>
        </div>
      </div>
    </div>
  );
}
