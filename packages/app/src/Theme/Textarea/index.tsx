export type Textarea = Styleable & {
  value?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
  placeholder?: string;
  title?: string | React.ReactNode;
  color?: "positive" | "negative" | "neutral";
};

export function Textarea({
  value,
  disabled,
  autoFocus,
  onChange,
  className,
  placeholder,
  title,
  color,
}: Textarea) {
  return (
    <div className="flex flex-col gap-2">
      {(title || color) && (
        <div className="flex items-center gap-2">
          {color && (
            <div
              className={classes(
                "aspect-square h-2.5 w-2.5 rounded-full",
                color === "positive" && "bg-brand-positive",
                color === "negative" && "bg-brand-negative",
                color === "neutral" && "bg-brand-gray-4"
              )}
            />
          )}
          {typeof title === "string" ? (
            <p className="text-sm">{title}</p>
          ) : (
            title
          )}
        </div>
      )}
      <textarea
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={classes(
          "bg-brand-amber-1 min-h-[8rem] max-w-[22rem] resize-none rounded border border-zinc-300/100 p-2 text-sm focus:border-black/30 focus:outline-none",
          disabled && "opacity-60",
          className
        )}
      />
    </div>
  );
}
