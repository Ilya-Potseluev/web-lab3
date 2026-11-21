import { auth } from '@/auth';
import { getProducts } from '@/lib/api';
import { ProductsClient } from '@/components/ProductsClient';

export default async function HomePage() {
	const [initialData, session] = await Promise.all([
		getProducts({ limit: 10, skip: 0 }),
		auth(),
	]);

	return <ProductsClient initialData={initialData} role={session?.user?.role} />;
}
