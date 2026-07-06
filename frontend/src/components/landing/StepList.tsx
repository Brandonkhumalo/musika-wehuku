interface Step {
  title: string;
  body: string;
}

const badgeClasses = {
  brand: "bg-brand-600",
  accent: "bg-accent-600",
};

export function StepList({ steps, color }: { steps: Step[]; color: "brand" | "accent" }) {
  return (
    <ol className="mt-4 flex flex-col gap-4">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${badgeClasses[color]} text-sm font-semibold text-white`}
          >
            {i + 1}
          </span>
          <div>
            <p className="font-medium">{step.title}</p>
            <p className="text-sm text-muted">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
