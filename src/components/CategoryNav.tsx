// CategoryNav.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryNav({ onSelectCategory }: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Fehler beim Laden der Kategorien:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    onSelectCategory(categoryId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstProduct = document.querySelector('[data-grid-item]');
      if (firstProduct instanceof HTMLElement) {
        firstProduct.focus();
      }
    }
  };

  return (
    <nav 
      className="bg-white shadow-lg mb-6" 
      role="navigation" 
      aria-label="Produktkategorien"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto py-4 space-x-4">
          <button
            onClick={() => handleCategoryClick(null)}
            onKeyDown={handleKeyDown}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === null 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            aria-pressed={selectedCategory === null}
          >
            Alle Produkte
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              onKeyDown={handleKeyDown}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-pressed={selectedCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}