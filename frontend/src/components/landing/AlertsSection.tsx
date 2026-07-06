"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export function AlertsSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800 dark:from-brand-900/60 dark:to-brand-950/60" />
      
      {/* Absolute decorative items */}
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center text-white">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand-100 uppercase backdrop-blur-sm">
          🔔 Alert Service
        </span>
        
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Never miss a fresh hatch date
        </h2>
        
        <p className="mt-4 text-lg text-brand-100/90 max-w-2xl mx-auto">
          Popular chick breeds like Cobb 500 sell out in hours. Subscribe to receive instant SMS or email notifications the moment verified hatcheries list new batches.
        </p>

        <div className="mt-10 max-w-md mx-auto">
          {isSubmitted ? (
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/20 animate-fade-in">
              <span className="text-3xl" aria-hidden>🎉</span>
              <h3 className="mt-2 text-lg font-bold">You are on the alert list!</h3>
              <p className="mt-1 text-sm text-brand-100/80">
                We will notify you as soon as new chick batches matching major hatch dates are published.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-xs font-semibold text-white underline hover:text-brand-100"
              >
                Sign up another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-brand-200/60 focus:ring-white focus:border-white rounded-xl py-3 px-4 outline-none"
              />
              <Button
                type="submit"
                loading={isLoading}
                className="bg-white text-brand-900 hover:bg-brand-50 hover:shadow-lg font-bold rounded-xl py-3 px-6 shrink-0 transition-all duration-300"
              >
                Subscribe to Alerts
              </Button>
            </form>
          )}
          <p className="mt-3 text-xs text-brand-200/60">
            No spam. Unsubscribe at any time with a single click.
          </p>
        </div>
      </div>
    </section>
  );
}
