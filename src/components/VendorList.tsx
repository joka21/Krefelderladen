'use client';

import { collection, query, getDocs, Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  type: 'retail' | 'service' | 'both';
  description: {
    short: string;
    detailed: string;
  };
  images: {
    logo: string;
    coverImage: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    zip: string;
    city: string;
  };
}

export default function VendorList() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError("Datenbank nicht verfügbar");
      setLoading(false);
      return;
    }

    const fetchVendors = async (database: Firestore) => {
      try {
        const q = query(collection(database, 'vendors'));
        const querySnapshot = await getDocs(q);
        const vendorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Vendor[];
        
        setVendors(vendorList);
        setLoading(false);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setError("Fehler beim Laden der Anbieter. Bitte laden Sie die Seite neu.");
        setLoading(false);
      }
    };

    fetchVendors(db);
  }, []);

  if (loading) {
    return <div role="status" className="text-center py-4">Lade Anbieter...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="block">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-48">
              <img
                src={vendor.images.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <img
                src={vendor.images.logo}
                alt={`${vendor.name} Logo`}
                className="absolute bottom-0 left-4 transform translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover bg-white"
              />
            </div>
            <div className="pt-12 p-6">
              <h2 className="text-xl font-bold">{vendor.name}</h2>
              <p className="text-gray-600 mt-2">{vendor.description.short}</p>
              <div className="mt-4 flex items-center text-gray-500">
                <span>{vendor.address.city}</span>
                <span className="mx-2">•</span>
                <span>{vendor.contact.phone}</span>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm
                  ${vendor.type === 'retail' ? 'bg-blue-100 text-blue-800' : 
                    vendor.type === 'service' ? 'bg-green-100 text-green-800' : 
                    'bg-purple-100 text-purple-800'}`}
                >
                  {vendor.type === 'retail' ? 'Einzelhandel' : 
                   vendor.type === 'service' ? 'Dienstleistung' : 
                   'Handel & Service'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}