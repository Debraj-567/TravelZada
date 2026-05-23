import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PackageCard } from '../components/packages/PackageCard';
import { SearchBar } from '../components/packages/SearchBar';
import { AddPackageModal } from '../components/packages/AddPackageModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_PACKAGES } from '../data/packages';
import type { Package } from '../types/package';
import { Plus, Package as PackageIcon } from 'lucide-react';
import { generatePackagePDF } from '../utils/generatePackagePDF';

/**
 * Packages Page component.
 * Manages package inventory with real-time search and creation.
 */
const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<readonly Package[]>(MOCK_PACKAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized filtering for performance
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [packages, searchQuery]);

  const handleAddPackage = (newPackage: Package) => {
    setPackages((prev) => [newPackage, ...prev]);
  };

  /**
   * Triggers professional PDF export for a specific package.
   */
  const handleExportSingle = (pkg: Package) => {
    generatePackagePDF(pkg);
  };

  return (
    <PageContainer>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Travel Packages
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage your travel inventory, create new experiences, and export reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          className="max-w-md w-full"
        />
        <div className="flex-1 flex justify-end">
          <p className="text-xs font-medium text-muted-foreground">
            Showing <span className="text-foreground">{filteredPackages.length}</span> of <span className="text-foreground">{packages.length}</span> packages
          </p>
        </div>
      </div>

      {/* Content Section */}
      {filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPackages.map((pkg) => (
            <PackageCard 
              key={pkg.id} 
              packageData={pkg} 
              onExport={handleExportSingle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={PackageIcon}
          title={searchQuery ? "No matching packages" : "No packages found"}
          description={
            searchQuery 
              ? `We couldn't find any packages matching "${searchQuery}". Try a different search term.` 
              : "Get started by adding your first travel package to the system."
          }
          action={searchQuery ? {
            label: "Clear Search",
            onClick: () => setSearchQuery('')
          } : {
            label: "Add Package",
            onClick: () => setIsModalOpen(true)
          }}
        />
      )}

      {/* Add Package Modal */}
      <AddPackageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddPackage}
      />
    </PageContainer>
  );
};

export default PackagesPage;
