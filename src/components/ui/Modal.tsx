import { useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { LucideX } from "lucide-react";
import { cn } from "./ui.utils";
import { Button } from "./Button";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw] md:max-w-[80vw]",
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-t-2xl sm:rounded-2xl bg-card shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300",
          "max-h-[92vh] sm:max-h-[85vh] flex flex-col",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4 sm:px-6">
          <div className="space-y-1">
            {title && (
              <h2 className="text-base sm:text-lg font-semibold leading-none tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 rounded-full p-0 shrink-0"
            aria-label="Close modal"
          >
            <LucideX className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar overscroll-contain">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end space-x-2 border-t border-border/50 bg-muted/30 px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export { Modal };
