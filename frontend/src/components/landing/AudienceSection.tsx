import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

// Checkmark SVG for list items
function BuyerCheck() {
  return (
    <svg className="h-5 w-5 text-accent-600 dark:text-accent-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SellerCheck() {
  return (
    <svg className="h-5 w-5 text-brand-600 dark:text-brand-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function AudienceSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      {/* Background glow blobbies */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-50/40 to-transparent dark:from-brand-900/5"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Tailored Experiences
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            A platform designed for both sides of the market
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card for Farmers/Buyers */}
          <Card className="group relative overflow-hidden border border-border/80 bg-surface hover:shadow-xl hover:border-accent-500/25 transition-all duration-300 dark:bg-surface/40">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-accent-600" />
            <CardBody className="flex h-full flex-col gap-6 p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/40 text-2xl" aria-hidden>
                  🧑‍🌾
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-foreground">Farmers &amp; Agro-Dealers</h3>
                  <p className="text-xs text-muted">Secure high-quality chick reservations</p>
                </div>
              </div>

              <hr className="border-border/60" />

              <ul className="flex flex-1 flex-col gap-4 text-sm text-foreground/80">
                <li className="flex items-start gap-3">
                  <BuyerCheck />
                  <span>Browse chick and table egg batches from certified hatcheries near you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BuyerCheck />
                  <span>Reserve securely online with a 30% deposit or pay in full.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BuyerCheck />
                  <span>Collect and physically inspect chicks before completing the payment.</span>
                </li>
              </ul>

              <ButtonLink
                href="/register?role=buyer"
                variant="outline"
                className="mt-4 border-accent-600/30 text-accent-700 hover:bg-accent-50 dark:text-accent-400 dark:border-accent-500/30 dark:hover:bg-accent-950/20 py-3 font-semibold transition-all duration-300"
              >
                Register as a Buyer
              </ButtonLink>
            </CardBody>
          </Card>

          {/* Card for Sellers/Hatcheries */}
          <Card className="group relative overflow-hidden border border-border/80 bg-surface hover:shadow-xl hover:border-brand-500/25 transition-all duration-300 dark:bg-surface/40">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-brand-500" />
            <CardBody className="flex h-full flex-col gap-6 p-8 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/40 text-2xl" aria-hidden>
                  🐣
                </span>
                <div>
                  <h3 className="font-extrabold text-xl text-foreground">Hatcheries &amp; Breeders</h3>
                  <p className="text-xs text-muted">Streamline listings and batch sales</p>
                </div>
              </div>

              <hr className="border-border/60" />

              <ul className="flex flex-1 flex-col gap-4 text-sm text-foreground/80">
                <li className="flex items-start gap-3">
                  <SellerCheck />
                  <span>List available chick and table egg batches to thousands of verified buyers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <SellerCheck />
                  <span>Manage deposits, orders, and branch handovers with ease.</span>
                </li>
                <li className="flex items-start gap-3">
                  <SellerCheck />
                  <span>Get paid out automatically once Elite Breeds verifies the collection.</span>
                </li>
              </ul>

              <ButtonLink
                href="/register?role=seller"
                variant="primary"
                className="mt-4 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 py-3 font-semibold transition-all duration-300"
              >
                Register as a Seller
              </ButtonLink>
            </CardBody>
          </Card>
        </div>

        <div className="mt-12 rounded-xl bg-surface/50 border border-border p-5 text-center text-sm text-muted max-w-3xl mx-auto dark:bg-surface/20">
          ⚠️ **Important Note**: Musika WeHuku is designed for day-old chick, broiler, and table egg batch reservations. It is not a general classified site for crops or general livestock.
        </div>
      </div>
    </section>
  );
}
