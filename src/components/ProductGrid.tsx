'use client';

import { collection, query, getDocs, limit, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { Firestore } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  description: {
    short: string;
  };
  price: number;
  images: {
    main: string;
  };
  category: string;
  type: 'product' | 'service';
  status: string;
}

export default function ProductGrid({ selectedCategory }: { 
  selectedCategory: string | null 
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
        if (!db) {
          console.error('Firestore database is not initialized.');
          setLoading(false);
          return;
        }
        let q;
        try {
          if (selectedCategory) {
            q = query(
              collection(db, 'products'),
              where('category', '==', selectedCategory),
              limit(20)
            );
          } else {
            q = query(collection(db, 'products'), limit(20));
          }

          const querySnapshot = await getDocs(q);
          const productsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as object
          })) as Product[];

          if (!selectedCategory) {
            productsList.sort(() => Math.random() - 0.5);
          }

          setProducts(productsList);
        } catch (error) {
          console.error('Fehler beim Laden der Produkte:', error);
        }
        setLoading(false);
      };
    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return <div className="text-center py-10">Lade Produkte...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: Product) => (
        <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={product.images.main}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{product.description.short}</p>
            <p className="text-lg font-bold text-blue-600">
              {product.price.toFixed(2)} €
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}