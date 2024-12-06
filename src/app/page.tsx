'use client';

import { useState } from 'react';
import CategoryNav from '@/components/CategoryNav';
import ProductGrid from '@/components/ProductGrid';
import { createInitialVendors } from '../lib/vendors';
import VendorList from '../components/VendorList';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <CategoryNav onSelectCategory={setSelectedCategory} />
      <ProductGrid selectedCategory={selectedCategory} />
      
    </div>
  );
}