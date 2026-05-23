import React from 'react';
import type { Package } from '../../types/package';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, Tag, FileText } from 'lucide-react';

interface PackageCardProps {
  packageData: Package;
  onExport?: (pkg: Package) => void;
}

/**
 * PackageCard component.
 * Displays package details with a clean B2B SaaS aesthetic.
 */
export const PackageCard: React.FC<PackageCardProps> = ({ packageData, onExport }) => {
  const { 
    name, 
    destination, 
    duration, 
    price, 
    currency, 
    status, 
    type, 
    image 
  } = packageData;

  return (
    <Card 
      className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md border-border/50 focus-within:ring-2 focus-within:ring-primary/20 outline-none"
      tabIndex={0}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} className="shadow-sm backdrop-blur-md bg-white/90 dark:bg-black/50" />
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-white/90 dark:bg-black/50 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold">
            {type}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{destination}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1">Duration</span>
              <span className="text-xs font-semibold text-foreground">{duration}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <Tag className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1">Pricing</span>
              <span className="text-xs font-semibold text-foreground">{currency} {price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer / Action area */}
        <div className="mt-auto pt-4 border-t border-border/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Starting from</span>
              <div className="flex items-center text-primary font-bold">
                <span className="text-xl">{price.toLocaleString()}</span>
                <span className="text-xs ml-1 font-medium">{currency}</span>
              </div>
            </div>
            <Button size="sm">
              Details
            </Button>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full h-8 text-[10px] font-bold uppercase tracking-wider"
            onClick={(e) => {
              e.stopPropagation();
              onExport?.(packageData);
            }}
          >
            <FileText className="mr-2 h-3 w-3" />
            Export PDF Report
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Internal Badge for type as I didn't want to create a separate file for a small variant
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`px-2 py-0.5 rounded-full text-xs font-medium border border-border/50 ${className}`}>
    {children}
  </div>
);
