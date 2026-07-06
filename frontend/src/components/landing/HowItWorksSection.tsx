"use client";

import { useState } from "react";

const buyerSteps = [
  {
    step: "01",
    title: "Create a free buyer account",
    body: "Sign up as a Farmer or Buyer in under two minutes. All you need is your name, phone number, and a password.",
  },
  {
    step: "02",
    title: "Browse and reserve a batch",
    body: "Filter active batches by breed, price, or hatch date. Reserve your preferred quantity with a secure 30% deposit or pay in full.",
  },
  {
    step: "03",
    title: "Collect at your chosen branch",
    body: "Once staff approve your payment proof, visit the chosen Elite Breeds branch. Inspect the chicks and complete checkout on handover.",
  },
];

const sellerSteps = [
  {
    step: "01",
    title: "Register your hatchery",
    body: "Sign up as a Breeder or Hatchery. Enter your verified business details, farm address, and contact information.",
  },
  {
    step: "02",
    title: "Publish your listings",
    body: "Create listings with breed type, hatch date, total quantity, and unit price. Choose the collection branch and submit.",
  },
  {
    step: "03",
    title: "Get paid upon verified handover",
    body: "Follow reservations live. Once buyers collect and Elite Breeds staff verify the batch count, funds are released directly to you.",
  },
];

export function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const steps = activeTab === "buyer" ? buyerSteps : sellerSteps;

  return (
    <section className="border-y border-border bg-surface/50 py-16 sm:py-20 relative overflow-hidden dark:bg-surface/10">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Process Overview
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            How Musika WeHuku works
          </p>
          <p className="mt-4 text-lg text-muted">
            A simple, secure process from listing to verified pickup. Select a tab below to see how it works for you.
          </p>

          {/* Premium Tab Toggle */}
          <div className="mt-8 inline-flex rounded-full bg-background border border-border p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab("buyer")}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === "buyer"
                  ? "bg-accent-600 text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              For Farmers &amp; Buyers
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeTab === "seller"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              For Hatcheries &amp; Breeders
            </button>
          </div>
        </div>

        {/* Step Cards with Connecting Line */}
        <div className="relative mt-12">
          {/* Vertical connecting line for desktop */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 hidden md:block z-0" />

          <div className="grid gap-8 md:grid-cols-3 relative z-10">
            {steps.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl border border-border/80 bg-surface p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-500/20 transition-all duration-300 flex flex-col items-start dark:bg-surface/50"
              >
                {/* Step Number Badge */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-extrabold text-lg text-white mb-6 shadow-sm transition-colors duration-300 ${
                  activeTab === "buyer" ? "bg-accent-600 group-hover:bg-accent-700" : "bg-brand-600 group-hover:bg-brand-700"
                }`}>
                  {item.step}
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted flex-1">
                  {item.body}
                </p>

                {/* Decorative step indicator line for mobile/tablet */}
                <div className="absolute left-6 -bottom-4 w-0.5 h-4 bg-border md:hidden last:hidden" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
