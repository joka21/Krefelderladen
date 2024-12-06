'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Make sure the correct path is used

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
}

export default function CategoryNav({
  selectedCategory,
  setSelectedCategory,
}: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Ensure the db object is defined before attempting to fetch data
    if (!db) {
      console.error("Firebase 'db' instance is not initialized.");
      return;
    }

    const fetchCategories = async () => {
      try {
        if (db) {
          const querySnapshot = await getDocs(collection(db, 'categories'));
          const categoriesList = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setCategories(categoriesList);
        } else {
          console.error("Firebase 'db' instance is not initialized.");
        }
      } catch (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <nav className="bg-white shadow-lg mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto py-4 space-x-4">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Alle Produkte
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
