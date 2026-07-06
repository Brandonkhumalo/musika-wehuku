import { Card, CardBody } from "@/components/ui/Card";

// Beautiful SVG Icons
function SearchIcon() {
  return (
    <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

const benefits = [
  {
    icon: <SearchIcon />,
    title: "No more running around",
    body: "Stop calling dozens of hatcheries or driving around to check stock. View multiple breeders, prices, and hatch dates on a single page, right from your phone.",
  },
  {
    icon: <LockIcon />,
    title: "Never lose your spot",
    body: "Secure your batch with a deposit immediately. Your reservation holds your stock in place, ensuring it isn't sold to someone else while you travel.",
  },
  {
    icon: <VerifiedIcon />,
    title: "Vetted, official hatcheries",
    body: "Every seller is verified with legal business identification and registration. You always buy from trusted breeders, never anonymous middlemen.",
  },
  {
    icon: <HandshakeIcon />,
    title: "Pay with absolute peace of mind",
    body: "Your funds are securely held in escrow until Elite Breeds staff verify the batch count and health at the branch during pickup.",
  },
];

export function BenefitsSection() {
  return (
    <section className="border-y border-border bg-surface/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Why Musika WeHuku?
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            A secure way to source your day-old chicks and table eggs
          </p>
          <p className="mt-4 text-lg text-muted">
            We bridge the gap between Zimbabwe&apos;s leading hatcheries and poultry farmers. No more risk, no more wasted fuel, no more lost opportunities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="group border border-border/80 hover:border-brand-500/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-surface dark:bg-surface/50"
            >
              <CardBody className="flex gap-4 p-6 sm:p-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/60 transition-colors duration-300">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{benefit.body}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
