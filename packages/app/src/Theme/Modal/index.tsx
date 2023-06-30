import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { Theme } from "~/Theme";

export type Props = StyleableWithChildren & {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  containerClassName?: string;
  bottom?: React.ReactNode;
  showCloseButton?: boolean;
};

export function Modal({
  open,
  onClose,
  className,
  children,
  title,
  containerClassName,
  bottom,
  showCloseButton = true,
}: Props) {
  useCloseOnEscapeKey(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <>
          <Backdrop open={open} onClose={onClose} />

          <motion.div
            className={classes(
              "pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center sm:p-8"
            )}
            variants={insideVariants}
            initial="closed"
            animate={open ? "open" : "closed"}
            exit="closed"
          >
            <div
              className={classes(
                "bg-brand-amber-1 pointer-events-auto flex flex-col rounded-xl",
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between p-4 pb-2 text-lg text-black">
                  {title}
                  {showCloseButton && (
                    <button
                      className="text-black duration-100 hover:text-black/50"
                      onClick={onClose}
                    >
                      <Theme.Icon.X />
                    </button>
                  )}
                </div>
              )}
              <div
                className={classes(
                  "p-4 pb-10 pt-20 text-sm text-neutral-500",
                  containerClassName
                )}
              >
                {children}
              </div>
              {bottom && <div className="bg-black/5">{bottom}</div>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function useCloseOnEscapeKey(open?: boolean, onClose?: () => void): void {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);
}

function Backdrop({
  open,
  onClose,
  className,
}: {
  open?: boolean;
  onClose?: () => void;
  className?: string;
}) {
  useScrollLock();

  return (
    <motion.div
      className={classes(
        "absolute inset-0 z-[9999] flex items-center justify-center",
        className
      )}
      variants={outSideVariants}
      initial="closed"
      animate={open ? "open" : "closed"}
      exit="closed"
      onClick={onClose}
    >
      <motion.div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900 bg-opacity-40"
      />
    </motion.div>
  );
}

function useScrollLock() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
}

const outSideVariants = {
  closed: {
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.1,
    },
  },
  open: {
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.1,
    },
  },
};

const insideVariants = {
  closed: {
    scale: 0.9,
    opacity: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 500,
      restSpeed: 10,
    },
  },
  open: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 500,
      restSpeed: 0.1,
    },
  },
};
