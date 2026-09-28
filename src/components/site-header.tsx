import { Link } from "@tanstack/react-router";
import { Headphones, Mail, Phone, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <TrendingUp className="size-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            UTG Media
          </span>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Headphones className="size-4" />
              <span className="hidden sm:inline">Need help?</span>
              <span className="sm:hidden">Help</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-2.5 text-sm">
              <p className="font-medium text-foreground">We're here to help</p>
              <a
                href="tel:+18005551234"
                className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-primary" />
                (800) 555-1234
              </a>
              <a
                href="mailto:hello@utgmedia.com"
                className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-primary" />
                hello@utgmedia.com
              </a>
              <p className="border-t border-border pt-2 text-xs text-muted-foreground">
                Mon–Fri, 8am–7pm CT
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
