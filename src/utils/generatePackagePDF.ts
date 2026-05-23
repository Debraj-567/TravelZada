import { jsPDF } from 'jspdf';
import type { Package } from '../types/package';

/**
 * CONFIGURATION CONSTANTS
 * Centralized layout parameters to ensure consistent spacing and rhythm.
 */
const CONFIG = {
  MARGIN: 20,
  PAGE_WIDTH: 210, // A4 standard
  PAGE_HEIGHT: 297,
  LINE_HEIGHT: 7,
  COLORS: {
    PRIMARY: '#18181b', // Zinc-900
    SECONDARY: '#71717a', // Zinc-500
    ACCENT: '#0f172a', // Primary
    BORDER: '#e4e4e7', // Zinc-200
  },
  FONTS: {
    TITLE: 22,
    SECTION: 14,
    LABEL: 10,
    VALUE: 11,
    FOOTER: 8,
  }
};

/**
 * UTILITY HELPERS
 */

/**
 * Sanitizes strings for safe filename usage.
 */
const sanitizeFilename = (name: string): string => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

/**
 * Checks if current Y position will overflow, adds page if needed.
 */
const checkPageOverflow = (doc: jsPDF, currentY: number, neededHeight: number): number => {
  if (currentY + neededHeight > CONFIG.PAGE_HEIGHT - CONFIG.MARGIN) {
    doc.addPage();
    return CONFIG.MARGIN + 10;
  }
  return currentY;
};

/**
 * PROFESSIONAL PDF GENERATOR
 * Generates a business-grade report for a travel package.
 */
export const generatePackagePDF = (pkg: Package) => {
  const doc = new jsPDF();
  let currentY = CONFIG.MARGIN;

  // --- 1. HEADER SECTION ---
  // Logo Placeholder Box
  doc.setDrawColor(CONFIG.COLORS.BORDER);
  doc.setFillColor(CONFIG.COLORS.PRIMARY);
  doc.roundedRect(CONFIG.MARGIN, currentY, 12, 12, 2, 2, 'F');
  
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('T', CONFIG.MARGIN + 4.5, currentY + 8.5);

  // Title & Timestamp
  doc.setTextColor(CONFIG.COLORS.PRIMARY);
  doc.setFontSize(CONFIG.FONTS.TITLE);
  doc.text('Travelzada DMC', CONFIG.MARGIN + 18, currentY + 8);
  
  doc.setFontSize(CONFIG.FONTS.FOOTER);
  doc.setTextColor(CONFIG.COLORS.SECONDARY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, CONFIG.PAGE_WIDTH - CONFIG.MARGIN, currentY + 7, { align: 'right' });

  currentY += 25;

  // --- 2. PACKAGE OVERVIEW SECTION ---
  doc.setDrawColor(CONFIG.COLORS.BORDER);
  doc.line(CONFIG.MARGIN, currentY, CONFIG.PAGE_WIDTH - CONFIG.MARGIN, currentY);
  currentY += 12;

  doc.setFontSize(CONFIG.FONTS.SECTION);
  doc.setTextColor(CONFIG.COLORS.PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.text(pkg.name, CONFIG.MARGIN, currentY);
  currentY += 10;

  // Info Grid
  const details = [
    { label: 'Destination', value: pkg.destination },
    { label: 'Duration', value: pkg.duration },
    { label: 'Category', value: pkg.type },
    { label: 'Status', value: pkg.status.toUpperCase() },
  ];

  doc.setFontSize(CONFIG.FONTS.LABEL);
  doc.setTextColor(CONFIG.COLORS.SECONDARY);
  
  details.forEach((detail, index) => {
    const xPos = CONFIG.MARGIN + (index % 2) * 85;
    const yPos = currentY + Math.floor(index / 2) * 15;
    
    doc.setFont('helvetica', 'bold');
    doc.text(detail.label, xPos, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(CONFIG.COLORS.PRIMARY);
    doc.setFontSize(CONFIG.FONTS.VALUE);
    doc.text(detail.value, xPos, yPos + 6);
    
    doc.setFontSize(CONFIG.FONTS.LABEL);
    doc.setTextColor(CONFIG.COLORS.SECONDARY);
  });

  currentY += 35;

  // Pricing Box
  doc.setFillColor('#f8fafc'); // Zinc-50 equivalent
  doc.roundedRect(CONFIG.MARGIN, currentY, CONFIG.PAGE_WIDTH - (CONFIG.MARGIN * 2), 20, 2, 2, 'F');
  
  doc.setTextColor(CONFIG.COLORS.SECONDARY);
  doc.setFont('helvetica', 'bold');
  doc.text('Starting Price', CONFIG.MARGIN + 10, currentY + 12);
  
  doc.setTextColor(CONFIG.COLORS.PRIMARY);
  doc.setFontSize(18);
  doc.text(`${pkg.currency} ${pkg.price.toLocaleString()}`, CONFIG.PAGE_WIDTH - CONFIG.MARGIN - 10, currentY + 13, { align: 'right' });

  currentY += 35;

  // --- 3. ITINERARY / DESCRIPTION SECTION ---
  currentY = checkPageOverflow(doc, currentY, 40);
  
  doc.setFontSize(CONFIG.FONTS.SECTION);
  doc.setTextColor(CONFIG.COLORS.PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.text('Package Details & Itinerary', CONFIG.MARGIN, currentY);
  
  currentY += 4;
  doc.setDrawColor(CONFIG.COLORS.BORDER);
  doc.line(CONFIG.MARGIN, currentY, CONFIG.MARGIN + 40, currentY);
  currentY += 10;

  doc.setFontSize(CONFIG.FONTS.VALUE);
  doc.setTextColor(CONFIG.COLORS.PRIMARY);
  doc.setFont('helvetica', 'normal');

  const splitDescription = doc.splitTextToSize(pkg.description || 'No detailed itinerary provided for this package.', CONFIG.PAGE_WIDTH - (CONFIG.MARGIN * 2));
  
  splitDescription.forEach((line: string) => {
    currentY = checkPageOverflow(doc, currentY, CONFIG.LINE_HEIGHT);
    doc.text(line, CONFIG.MARGIN, currentY);
    currentY += CONFIG.LINE_HEIGHT;
  });

  // --- 4. FOOTER ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(CONFIG.FONTS.FOOTER);
    doc.setTextColor(CONFIG.COLORS.SECONDARY);
    
    // Bottom line
    doc.setDrawColor(CONFIG.COLORS.BORDER);
    doc.line(CONFIG.MARGIN, CONFIG.PAGE_HEIGHT - 15, CONFIG.PAGE_WIDTH - CONFIG.MARGIN, CONFIG.PAGE_HEIGHT - 15);
    
    doc.text('Generated by Travelzada · travelzada.com', CONFIG.MARGIN, CONFIG.PAGE_HEIGHT - 10);
    doc.text(`Page ${i} of ${pageCount}`, CONFIG.PAGE_WIDTH - CONFIG.MARGIN, CONFIG.PAGE_HEIGHT - 10, { align: 'right' });
  }

  // --- 5. EXPORT ---
  const filename = `${sanitizeFilename(pkg.name)}.pdf`;
  doc.save(filename);
};
