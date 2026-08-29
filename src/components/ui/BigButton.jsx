const VARIANTS = {
  primary: "bg-cta text-cta-ink hover:brightness-95 shadow-[0_6px_16px_-4px_rgb(246_200_76/55%)]",
  brand: "bg-brand text-white hover:bg-brand-dark shadow-[0_6px_16px_-4px_rgb(118_87_232/45%)]",
  green: "bg-olive-green text-white hover:bg-olive-green-dark shadow-[0_6px_16px_-4px_rgb(99_184_124/45%)]",
  gold: "bg-olive-gold text-olive-ink hover:brightness-95 shadow-[0_6px_16px_-4px_rgb(246_200_76/45%)]",
  outline: "bg-white text-olive-ink border border-border hover:border-brand/40 hover:text-brand",
  ghost: "bg-surface-alt text-olive-trunk hover:bg-black/[0.04]",
};

export default function BigButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3.5 rounded-2xl text-base font-bold transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
