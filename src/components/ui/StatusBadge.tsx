import React from 'react';
import { Badge } from './Badge';
import type { BadgeProps } from '../../types/components';

interface StatusBadgeProps {
  label: string;
  variant: BadgeProps['variant'];
  className?: string;
}

/**
 * Generic StatusBadge primitive.
 * Used to render consistent status indicators across the system.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  variant, 
  className 
}) => {
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};
