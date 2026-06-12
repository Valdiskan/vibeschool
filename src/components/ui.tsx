import * as React from "react";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "lime" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-ink px-4 py-2 font-semibold transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet";
  const variants = {
    primary: "bg-violet text-white shadow-pop hover:bg-violet-dark",
    lime: "bg-lime text-ink shadow-pop hover:bg-[#a8e62f]",
    ghost: "bg-white text-ink shadow-popSm hover:bg-violet-soft",
    danger: "bg-coral text-white shadow-pop hover:opacity-90",
  };
  return <button className={cx(base, variants[variant], className)} {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("rounded-2xl border-2 border-ink bg-white shadow-pop", className)}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-violet",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full rounded-xl border-2 border-ink bg-white px-3 py-2 font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-violet",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("mb-1 block text-sm font-semibold text-ink", className)} {...props} />;
}

export function Badge({
  className,
  color = "violet",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { color?: "violet" | "lime" | "ink" }) {
  const colors = {
    violet: "bg-violet-soft text-violet-dark",
    lime: "bg-lime/40 text-ink",
    ink: "bg-ink text-white",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold",
        colors[color],
        className
      )}
      {...props}
    />
  );
}

export function StepChip({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-lime font-display text-sm font-bold">
        {n}
      </span>
      <span className="font-display text-sm font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}
