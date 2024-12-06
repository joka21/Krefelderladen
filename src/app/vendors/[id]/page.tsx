import { getVendorById } from '@/lib/vendors';

export default async function VendorPage({ params }: { params: { id: string } }) {
  const vendor = await getVendorById(params.id);

  if (!vendor) return <div>Anbieter nicht gefunden</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{vendor.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img src={vendor.images.coverImage} alt={vendor.name} className="w-full rounded-lg" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Über uns</h2>
          <p>{vendor.description.detailed}</p>
          <div className="mt-4">
            <h3 className="font-semibold">Kontakt</h3>
            <p>{vendor.contact.name}</p>
            <p>{vendor.contact.email}</p>
            <p>{vendor.contact.phone}</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Adresse</h3>
            <p>{vendor.address.street} {vendor.address.number}</p>
            <p>{vendor.address.zip} {vendor.address.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}