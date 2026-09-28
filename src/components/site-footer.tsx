import { TrendingUp } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="size-3.5" strokeWidth={2.5} />
          </span>
          <span className="font-medium text-foreground">UTG Media</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="hidden sm:inline">Lead pipelines for home-service teams.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </a>
          <a href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
          <span className="text-muted-foreground/70">© {year} UTG Media</span>
        </div>
      </div>
    </footer>
  );
}
