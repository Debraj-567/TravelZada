import type { ReactNode, ElementType } from "react";
import { cn } from "./ui.utils";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center animate-in fade-in duration-500",
        className
      )}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
        {Icon ? (
          <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
        )}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
      {action && (
        <Button onClick={action.onClick} className="mt-8" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
