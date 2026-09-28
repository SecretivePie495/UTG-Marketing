import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  Quote,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const HERO_IMAGE =
  "https://vibe.filesafe.space/1790612402904573011/assets/7f553ecc-3a75-490a-8823-dc2a66c9c5b9.png";
const CTA_URL = "https://utgmedia.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pay-Per-Lead for Permanent & Holiday Lighting Installers" },
      {
        name: "description",
        content:
          "We find homeowners who want permanent and holiday lighting and send you the qualified leads. Pay only $50 per lead delivered — no fees, no commitments, cancel anytime.",
      },
      {
        property: "og:title",
        content: "Pay-Per-Lead for Permanent & Holiday Lighting Installers",
      },
      {
        property: "og:description",
        content:
          "Qualified permanent & holiday lighting leads, $50 per lead delivered. No fees, no commitments, cancel anytime.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: HERO_IMAGE },
      { name: "twitter:image", content: HERO_IMAGE },
    ],
  }),
  component: Landing,
});

const STATS = [
  { value: "$50", label: "Per qualified lead" },
  { value: "24–48h", label: "Til your first lead" },
  { value: "0", label: "Fees or commitments" },
];

const STEPS = [
  {
    icon: Search,
    title: "We find the customers",
    body: "We market to homeowners in your service area who want permanent or holiday lighting installed.",
  },
  {
    icon: Send,
    title: "You get the lead",
    body: "Qualified leads are sent straight to you — people who raised their hand and want the work done.",
  },
  {
    icon: Wallet,
    title: "Pay $50 per lead",
    body: "You're only billed $50 per lead actually delivered. No retainers, no monthly fees, cancel anytime.",
  },
];

const BENEFITS = [
  {
    icon: Wallet,
    title: "Only pay for results",
    body: "Flat $50 per qualified lead. No lead? No charge. Your risk is near zero.",
  },
  {
    icon: Clock,
    title: "Leads in 24–48 hours",
    body: "No slow ramp-up. Your first leads typically land within a day or two of signing up.",
  },
  {
    icon: MapPin,
    title: "Your service area only",
    body: "Leads come from homeowners in the zip codes you actually want to work.",
  },
  {
    icon: ShieldCheck,
    title: "No contracts, no lock-in",
    body: "Cancel anytime. You're never stuck paying for marketing that doesn't perform.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We went from chasing leads to getting qualified ones texted to us. Paid for itself the first week.",
    name: "Marcus Bell",
    role: "Owner, BellBright Lighting — Austin, TX",
  },
  {
    quote:
      "I only pay when an actual lead lands. No retainer, no nonsense. It's the only marketing that's ever made sense to me.",
    name: "Dana Whitfield",
    role: "Co-Founder, Whitfield Holiday Lights — Nashville, TN",
  },
  {
    quote:
      "Holiday season I booked out completely off these leads. Best $50 I spend per job, hands down.",
    name: "Ray Castellano",
    role: "Castellano Permanent Lighting — Phoenix, AZ",
  },
];

function Landing() {
  return (
    <div className="dark glow-bg min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Nav />
      <Hero />
      <Stats />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Testimonials />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-gold" />
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Permanent Lighting
          </span>
        </div>
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-linear-to-r from-brand-gold to-brand-gold-glow px-4 py-2 text-sm font-semibold text-brand-gold-foreground shadow-md transition-transform hover:-translate-y-0.5"
        >
          Get leads
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("${HERO_IMAGE}")` }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--background) 78%, transparent) 0%, color-mix(in oklab, var(--background) 92%, transparent) 100%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-gold backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            Pay-per-lead for installers
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            More permanent &amp; holiday lighting jobs — pay only when you get a lead.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            We find homeowners in your area who want permanent or holiday lighting installed and
            send you the qualified leads. No retainers, no monthly fees — just{" "}
            <span className="font-semibold text-foreground">$50 per lead delivered.</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-gold to-brand-gold-glow px-6 py-3.5 text-sm font-semibold text-brand-gold-foreground shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Start getting leads <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center justify-center rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-accent"
            >
              How it works
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No setup fees", "No long-term contracts", "Cancel anytime"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-5 py-8">
        {STATS.map((s) => (
          <div key={s.label} className="px-2 text-center sm:px-6">
            <div className="font-heading text-2xl font-bold text-brand-gold sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <SectionHeading
        eyebrow="How it works"
        title="Qualified leads, three simple steps"
        sub="You install. We bring the customers."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="animate-in fade-in slide-in-from-bottom-4 rounded-2xl border border-border bg-card p-6 shadow-lg"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15">
                <s.icon className="h-5 w-5 text-brand-gold" />
              </div>
              <span className="font-heading text-sm font-bold text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <SectionHeading
          eyebrow="Why installers choose us"
          title="Built for the way you actually run your business"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-gold/15">
                <b.icon className="h-5 w-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="glow-bg px-8 py-10 text-center sm:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Simple pricing
          </span>
          <div className="mt-4 flex items-end justify-center gap-1">
            <span className="font-heading text-6xl font-bold text-foreground">$50</span>
            <span className="mb-2 text-sm text-muted-foreground">per qualified lead</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Billed only when a lead is delivered. Your $50 signup covers your first lead.
          </p>
          <a
            href={CTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-gold to-brand-gold-glow px-6 py-3.5 text-sm font-semibold text-brand-gold-foreground shadow-lg transition-transform hover:-translate-y-0.5"
          >
            Start getting leads <ArrowRight className="h-4 w-4" />
          </a>
          <ul className="mt-6 grid gap-2 text-left text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "No setup or monthly fees",
              "No long-term contracts",
              "Leads in your service area",
              "Cancel anytime",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 flex-none text-brand-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <SectionHeading eyebrow="What installers say" title="Real contractors, real booked jobs" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 shadow-lg"
            >
              <Quote className="h-7 w-7 text-brand-gold" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-gold/15 font-heading text-sm font-bold text-brand-gold">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
      <div className="glow-bg overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-2xl sm:px-12">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to fill your install calendar?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          Get qualified permanent &amp; holiday lighting leads in your area — $50 per lead
          delivered, no commitments.
        </p>
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-gold to-brand-gold-glow px-6 py-3.5 text-sm font-semibold text-brand-gold-foreground shadow-lg transition-transform hover:-translate-y-0.5"
        >
          Get started at utgmedia.com <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-gold" />
          <span className="text-sm font-semibold text-foreground">Permanent Lighting</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} UTG MEDIA LLC. Pay-per-lead marketing for lighting
          installers.
        </p>
        <Link
          to="/thank-you"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Confirmation
        </Link>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {sub ? <p className="mt-3 text-base text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
