export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-charcoal">
      <div className="flex items-center gap-3 text-white/60">
        <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-gold [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-gold [animation-delay:300ms]" />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
