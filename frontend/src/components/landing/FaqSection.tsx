"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How does the reservation deposit work?",
    answer: "To hold a batch, you pay a 30% deposit online via EcoCash, OneMoney, or Bank Transfer and submit the proof of payment. This deposit secures your spot on the hatchery's hatch list. The remaining 70% is settled at the physical collection branch when you verify your chicks.",
  },
  {
    question: "What happens if there are health issues with the chicks at pickup?",
    answer: "Your payment is protected. At the Elite Breeds collection point, branch staff inspect the health, activity levels, and physical count of the chicks. If the batch doesn't meet quality standards or there is a shortfall, our staff will cancel the handover and initiate a refund of your deposit.",
  },
  {
    question: "Where are the collection points located?",
    answer: "Collection points are official, verified branches of Elite Breeds & Hatcheries. Currently, we support pickups in major hubs including Harare Central, Bulawayo, Mutare, and Gweru. You can view the exact address and contact details of the branch when browsing listings.",
  },
  {
    question: "How long does it take for my payment proof to be approved?",
    answer: "Elite Breeds branch staff review and verify uploaded payment receipts within 1 to 2 hours during normal business hours (8:00 AM - 5:00 PM Monday to Saturday). Once approved, your order status updates to 'Confirmed' and your chicks are locked in.",
  },
  {
    question: "Can I cancel my reservation?",
    answer: "Yes. You can cancel your booking at any time before uploading payment proof. If you've already paid the deposit, cancellations are allowed prior to hatchery confirmation, or if a dispute is registered during branch handover inspection.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-surface/30 border-b border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">
            Got Questions?
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </p>
          <p className="mt-4 text-lg text-muted">
            Find answers to common questions about reservation security, payments, and branch collection.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm transition-all duration-300 dark:bg-surface/40 hover:border-brand-500/20"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-bold text-foreground hover:bg-background/40 transition-colors duration-200"
                >
                  <span>{faq.question}</span>
                  <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-accent-600 text-white border-accent-600" : "text-muted"
                  }`}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px] border-t border-border/60" : "max-h-0"
                  }`}
                >
                  <p className="px-6 py-5 text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
