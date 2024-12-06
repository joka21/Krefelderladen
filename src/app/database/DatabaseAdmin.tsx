'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DatabaseAdmin() {
 const { user } = useAuth();
 const router = useRouter();
 const [isAdmin, setIsAdmin] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const checkAdmin = async () => {
     if (!user || !db) {
       router.push('/');
       return;
     }

     try {
       const userDoc = await getDoc(doc(db, 'users', user.uid));
       const isUserAdmin = userDoc.data()?.role === 'admin';
       
       if (!isUserAdmin) {
         router.push('/');
         return;
       }

       setIsAdmin(true);
       setLoading(false);
     } catch (error) {
       console.error("Fehler beim Prüfen der Admin-Rechte:", error);
       router.push('/');
     }
   };

   checkAdmin();
 }, [user, router]);

 const initializeCategories = async () => {
   if (!db) {
     alert('Datenbank nicht verfügbar');
     return;
   }

   try {
     const categories = [
       {
         id: 'health',
         name: "Gesundheit",
         subcategories: {
           pharmacy: {
             name: "Apotheken",
             typicalProducts: [
               "Verschreibungspflichtige Medikamente",
               "Freiverkäufliche Medikamente",
               "Nahrungsergänzungsmittel"
             ],
             standardServices: [
               "Medikationsberatung",
               "Rezeptservice",
               "Blutdruckmessung"
             ]
           },
           physio: {
             name: "Physiotherapie",
             typicalProducts: [
               "Therapiegeräte",
               "Trainingszubehör",
               "Massageprodukte"
             ],
             standardServices: [
               "Physiotherapie",
               "Massage",
               "Reha-Training"
             ]
           }
         }
       },
       {
         id: 'household',
         name: "Haushalt",
         subcategories: {
           cleaning: {
             name: "Reinigung",
             typicalProducts: [
               "Reinigungsmittel",
               "Reinigungsgeräte",
               "Waschmittel"
             ],
             standardServices: [
               "Haushaltsreinigung",
               "Wäscheservice",
               "Fensterreinigung"
             ]
           },
           furniture: {
             name: "Möbel",
             typicalProducts: [
               "Wohnzimmermöbel",
               "Schlafzimmermöbel",
               "Büromöbel"
             ],
             standardServices: [
               "Montageservice",
               "Lieferservice",
               "Möbelreparatur"
             ]
           }
         }
       },
       {
         id: 'crafts',
         name: "Handwerk",
         subcategories: {
           carpentry: {
             name: "Schreinerei",
             typicalProducts: [
               "Maßmöbel",
               "Holzprodukte",
               "Türen"
             ],
             standardServices: [
               "Möbelbau",
               "Reparaturen",
               "Montage"
             ]
           },
           electrical: {
             name: "Elektrik",
             typicalProducts: [
               "Elektromaterial",
               "Leuchtmittel",
               "Sicherheitstechnik"
             ],
             standardServices: [
               "Elektroinstallation",
               "Reparaturservice",
               "Sicherheitschecks"
             ]
           }
         }
       },
       {
         id: 'associations',
         name: "Vereine",
         subcategories: {
           sports: {
             name: "Sportvereine",
             typicalProducts: [
               "Sportausrüstung",
               "Vereinskleidung",
               "Trainingsmaterial"
             ],
             standardServices: [
               "Mitgliedschaften",
               "Trainingsangebote",
               "Veranstaltungen"
             ]
           },
           culture: {
             name: "Kulturvereine",
             typicalProducts: [
               "Veranstaltungstickets",
               "Merchandise",
               "Publikationen"
             ],
             standardServices: [
               "Kulturveranstaltungen",
               "Workshops",
               "Ausstellungen"
             ]
           }
         }
       },
       {
         id: 'social',
         name: "Soziales",
         subcategories: {
           elderly: {
             name: "Seniorenbetreuung",
             typicalProducts: [
               "Hilfsmittel",
               "Pflegeprodukte",
               "Alltagshilfen"
             ],
             standardServices: [
               "Pflegedienst",
               "Betreuungsangebote",
               "Haushalthilfe"
             ]
           },
           childcare: {
             name: "Kinderbetreuung",
             typicalProducts: [
               "Spielzeug",
               "Lernmaterialien",
               "Betreuungsbedarf"
             ],
             standardServices: [
               "Kinderbetreuung",
               "Förderangebote",
               "Ferienbetreuung"
             ]
           }
         }
       },
       {
         id: 'services',
         name: "Dienstleistungen",
         subcategories: {
           financial: {
             name: "Finanzdienstleistungen",
             typicalProducts: [
               "Versicherungen",
               "Anlagen",
               "Finanzprodukte"
             ],
             standardServices: [
               "Beratung",
               "Vermögensverwaltung",
               "Versicherungsservice"
             ]
           },
           it: {
             name: "IT-Services",
             typicalProducts: [
               "Hardware",
               "Software",
               "Netzwerkkomponenten"
             ],
             standardServices: [
               "IT-Support",
               "Netzwerkbetreuung",
               "Softwareentwicklung"
             ]
           }
         }
       },
       {
         id: 'legal',
         name: "Recht",
         subcategories: {
           lawyer: {
             name: "Rechtsanwälte",
             typicalProducts: [
               "Rechtsliteratur",
               "Formulare",
               "Dokumentvorlagen"
             ],
             standardServices: [
               "Rechtsberatung",
               "Vertretung",
               "Mediation"
             ]
           },
           tax: {
             name: "Steuerberater",
             typicalProducts: [
               "Steuersoftware",
               "Fachliteratur",
               "Buchhaltungssysteme"
             ],
             standardServices: [
               "Steuerberatung",
               "Buchhaltung",
               "Jahresabschlüsse"
             ]
           }
         }
       }
     ];

     console.log('Starte Kategorien-Initialisierung...');

     for (const category of categories) {
       console.log(`Erstelle Kategorie: ${category.name}`);
       
       const docRef = doc(db, 'categories', category.id);
       await setDoc(docRef, {
         name: category.name,
         subcategories: category.subcategories,
         createdAt: new Date(),
         updatedAt: new Date()
       });
     }

     console.log('Alle Kategorien erfolgreich erstellt');
     alert('Kategorien erfolgreich initialisiert!');
   } catch (error) {
     console.error('Fehler beim Initialisieren der Kategorien:', error);
     if (error instanceof Error) {
       alert(`Fehler beim Initialisieren der Kategorien: ${error.message}`);
     } else {
       alert('Ein unbekannter Fehler ist aufgetreten');
     }
   }
 };

 const initializeExampleProducts = async () => {
    if (!db) {
      alert('Datenbank nicht verfügbar');
      return;
    }

    try {
      const categories = ['health', 'household', 'crafts', 'associations', 'social', 'services', 'legal'];
      const statuses = ['available', 'out_of_stock', 'discontinued'];
      const types = ['product', 'service'];
      
      // Erstelle 100 Produkte einzeln
      for (let i = 0; i < 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const price = Math.floor(Math.random() * 10000) / 100;
        const imageId = Math.floor(Math.random() * 1000);

        const product = {
          name: `Beispielprodukt ${i + 1}`,
          vendorId: "example-vendor",
          category: category,
          type: types[Math.floor(Math.random() * types.length)],
          description: {
            short: `Kurzbeschreibung für Produkt ${i + 1}`,
            detailed: `Dies ist eine ausführliche Beschreibung für das Beispielprodukt ${i + 1}. Hier stehen normalerweise die Details und Eigenschaften des Produkts.`
          },
          price: price,
          duration: Math.floor(Math.random() * 120) + 30,
          images: {
            main: `https://picsum.photos/seed/${imageId}/400/300`,
            gallery: [
              `https://picsum.photos/seed/${imageId + 1}/400/300`,
              `https://picsum.photos/seed/${imageId + 2}/400/300`,
              `https://picsum.photos/seed/${imageId + 3}/400/300`
            ]
          },
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = doc(collection(db, 'products'));
        await setDoc(docRef, product);
        
        if ((i + 1) % 10 === 0) {
          console.log(`${i + 1} Produkte erstellt`);
        }
      }

      alert('100 Beispielprodukte erfolgreich erstellt!');
    } catch (error) {
      console.error('Fehler beim Erstellen der Beispielprodukte:', error);
      if (error instanceof Error) {
        alert(`Fehler beim Erstellen der Produkte: ${error.message}`);
      } else {
        alert('Ein unbekannter Fehler ist aufgetreten');
      }
    }
  };
 if (loading) {
   return <div>Loading...</div>;
 }

 if (!isAdmin) {
   return null;
 }

 return (
   <div className="max-w-7xl mx-auto px-4 py-8">
     <h1 className="text-2xl font-bold mb-6">Datenbank Administration</h1>
     
     <div className="space-y-6">
       <div className="bg-white p-6 rounded-lg shadow">
         <h2 className="text-xl font-semibold mb-4">Kategorien</h2>
         <div className="flex space-x-4">
           <button 
             onClick={initializeCategories}
             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
           >
             Kategorien initialisieren
           </button>
           <button 
             onClick={initializeExampleProducts}
             className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
           >
             Beispielprodukte erstellen
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}