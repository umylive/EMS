// ! STYLE IMPORTS
// Global styles and component-specific styles
import "./globals.css";
import "./styles/calendar.css";
// Next.js metadata type and Google font
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// ! FONT CONFIGURATION
// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] });

// ! METADATA CONFIGURATION
// Define application metadata for SEO and browser display
export const metadata: Metadata = {
  title: "Employee Management System", // Browser tab title
  description: "Modern employee management system", // Meta description
};

// ! ROOT LAYOUT COMPONENT
// Main layout wrapper for the entire application
export default function RootLayout({
  children, // Child components to be rendered within the layout
}: {
  children: React.ReactNode; // Type definition for children prop
}) {
  return (
    // ! HTML WRAPPER
    // Root HTML element with language and hydration warning suppression
    <html lang="en" suppressHydrationWarning>
      {/* ! BODY ELEMENT
          Applies Inter font and dark mode background styling */}
      <body className={`${inter.className} dark:bg-gray-900`}>{children}</body>
    </html>
  );
}
