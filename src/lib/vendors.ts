import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

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
    gallery?: string[];
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

export const createInitialVendors = async () => {
  const vendorsRef = collection(db, 'vendors');
  
  const initialVendors = [
    {
      name: "Schreiner Müller",
      type: "service",
      description: {
        short: "Ihr Experte für hochwertige Fenster und Türen",
        detailed: "Seit über 30 Jahren fertigen wir in unserer Krefelder Werkstatt hochwertige Fenster und Türen nach Maß. Wir legen besonderen Wert auf nachhaltige Materialien und traditionelle Handwerkskunst."
      },
      images: {
        logo: "/images/mueller-logo.jpg",
        coverImage: "/images/mueller-werkstatt.jpg",
        gallery: [
          "/images/mueller-arbeit1.jpg",
          "/images/mueller-arbeit2.jpg"
        ]
      },
      contact: {
        name: "Thomas Müller",
        email: "info@schreiner-mueller.de",
        phone: "02151-123456"
      },
      address: {
        street: "Holzweg",
        number: "12",
        zip: "47798",
        city: "Krefeld"
      }
    },
    {
      name: "Fahrrad Schmidt",
      type: "both",
      description: {
        short: "Ihr Fahrradfachgeschäft in Krefeld",
        detailed: "Bei uns finden Sie eine große Auswahl an Fahrrädern aller Art - vom City-Bike bis zum E-Bike. Unser geschultes Personal berät Sie gerne und führt auch Reparaturen durch."
      },
      images: {
        logo: "/images/schmidt-logo.jpg",
        coverImage: "/images/schmidt-laden.jpg",
        gallery: [
          "/images/schmidt-werkstatt.jpg",
          "/images/schmidt-ausstellung.jpg"
        ]
      },
      contact: {
        name: "Sarah Schmidt",
        email: "info@fahrrad-schmidt.de",
        phone: "02151-789012"
      },
      address: {
        street: "Radweg",
        number: "45",
        zip: "47799",
        city: "Krefeld"
      }
    }
  ];

  try {
    for (const vendor of initialVendors) {
      await addDoc(vendorsRef, vendor);
    }
    console.log("Initial vendors created successfully");
  } catch (error) {
    console.error("Error creating initial vendors:", error);
  }
};

// Neue CRUD-Funktionen
export const getAllVendors = async (): Promise<Vendor[]> => {
  const vendorsRef = collection(db, 'vendors');
  const snapshot = await getDocs(vendorsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
};

export const getVendorById = async (id: string): Promise<Vendor | null> => {
  const docRef = doc(db, 'vendors', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Vendor : null;
};

export const getVendorsByType = async (type: Vendor['type']): Promise<Vendor[]> => {
  const vendorsRef = collection(db, 'vendors');
  const q = query(vendorsRef, where('type', '==', type));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
};

export const createVendor = async (vendor: Omit<Vendor, 'id'>): Promise<string> => {
  const vendorsRef = collection(db, 'vendors');
  const docRef = await addDoc(vendorsRef, vendor);
  return docRef.id;
};

export const updateVendor = async (id: string, updates: Partial<Omit<Vendor, 'id'>>): Promise<void> => {
  const docRef = doc(db, 'vendors', id);
  await updateDoc(docRef, updates);
};

export const deleteVendor = async (id: string): Promise<void> => {
  const docRef = doc(db, 'vendors', id);
  await deleteDoc(docRef);
};