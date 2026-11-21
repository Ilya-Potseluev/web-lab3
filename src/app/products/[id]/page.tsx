import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/api';

export default async function ProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const product = await getProductById(Number(id));

	if (!product) {
		notFound();
	}

	return (
		<div className="space-y-4">
			<Link
				href="/"
				className="inline-block text-sm text-blue-600 hover:underline"
			>
				← Назад к списку
			</Link>

			<div className="space-y-3 rounded-lg border bg-white p-5 text-sm">
				<div>
					<span className="font-mono text-xs text-gray-500">
						#{product.id} · {product.category}
					</span>
					<h1 className="text-xl font-bold">{product.title}</h1>
				</div>

				<p className="text-gray-600">{product.description}</p>

				<div className="flex gap-6 border-t pt-3 text-xs text-gray-700">
					<span>
						Цена: <b>${product.price}</b>
					</span>
					<span>
						Остаток: <b>{product.stock}</b>
					</span>
					<span>
						Рейтинг: <b>★ {product.rating}</b>
					</span>
				</div>
			</div>
		</div>
	);
}
