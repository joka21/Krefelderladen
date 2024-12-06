import { getVendorById } from '@/lib/vendors';
import Image from 'next/image';
import { GetStaticPropsContext } from 'next';

interface VendorPageProps {
  params: {
    id: string;
  };
}

export default async function VendorPage({ params }: VendorPageProps) {
  const vendor = await getVendorById(params.id);

  if (!vendor) {
    return <div>Anbieter nicht gefunden</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{vendor.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Image
            src={vendor.images.coverImage}
            alt={vendor.name}
            width={800}
            height={600}
            className="rounded-lg"
          />
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
            <p>
              {vendor.address.street} {vendor.address.number}
            </p>
            <p>
              {vendor.address.zip} {vendor.address.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { params } = context;
  
  if (!params || !params.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      params: {
        id: params.id as string,
      },
    },
  };
}

export async function getStaticPaths() {
  // Assuming there's a function to get all vendors
  const vendors = await getAllVendors();
  const paths = vendors.map((vendor: any) => ({
    params: { id: vendor.id },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}
