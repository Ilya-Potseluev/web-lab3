import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { createProductAction } from '@/actions/product.actions';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';

export default async function NewProductPage() {
	const session = await auth();
	if (!session?.user) {
		redirect('/login');
	}

	async function handleCreate(formData: FormData) {
		'use server';
		const session = await auth();
		if (!session?.user) {
			redirect('/login');
		}
		const parsed = {
			title: String(formData.get('title') ?? ''),
			description: String(formData.get('description') ?? ''),
			category: String(formData.get('category') ?? ''),
			price: Number(formData.get('price') ?? 0),
			stock: Number(formData.get('stock') ?? 0),
			rating: Number(formData.get('rating') ?? 0),
		};
		await createProductAction(parsed);
		revalidateTag('products', 'max');
		redirect('/');
	}

	return (
		<div className="space-y-4">
			<Link
				href="/"
				className="inline-block text-sm text-blue-600 hover:underline"
			>
				← Назад к списку
			</Link>
			<h1 className="text-lg font-bold">Новый товар</h1>
			<form action={handleCreate} className="space-y-3 text-sm">
				<input
					name="title"
					required
					placeholder="Название"
					className="w-full rounded border px-3 py-2"
				/>
				<textarea
					name="description"
					required
					placeholder="Описание"
					className="w-full rounded border px-3 py-2"
				/>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
					<input
						name="category"
						required
						placeholder="Категория"
						className="rounded border px-3 py-2"
					/>
					<input
						name="price"
						type="number"
						step="0.01"
						required
						placeholder="Цена"
						className="rounded border px-3 py-2"
					/>
					<input
						name="stock"
						type="number"
						required
						placeholder="Остаток"
						className="rounded border px-3 py-2"
					/>
					<input
						name="rating"
						type="number"
						step="0.1"
						min="0"
						max="5"
						placeholder="Рейтинг"
						className="rounded border px-3 py-2"
					/>
				</div>
				<button
					type="submit"
					className="rounded bg-blue-600 px-3 py-1.5 font-medium text-white"
				>
					Создать
				</button>
			</form>
		</div>
	);
}
