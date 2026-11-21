'use client';

import { useEffect, useRef, useState } from 'react';
import { SearchInput } from './Search';
import { Product } from './Product';
import { ProductForm } from './ProductForm';
import { Pagination } from './Pagination';
import {
	createProductAction,
	updateProductAction,
	deleteProductAction,
} from '@/actions/product.actions';
import { useProductsStore } from '@/store/useProductsStore';
import type { GetProductsResponse, ProductFormData } from '@/lib/schemas';
import type { UserRole } from '@/lib/schemas';

const LIMIT = 10;

export function ProductsClient({
	initialData,
	role,
}: {
	initialData: GetProductsResponse;
	role?: UserRole;
}) {
	const {
		products,
		total,
		skip,
		searchQuery,
		loading,
		isMutating,
		error,
		init,
		setSkip,
		setSearchQuery,
		fetchPage,
		addProduct,
		updateProduct,
		removeProduct,
		setMutating,
		setError,
	} = useProductsStore();

	const [isCreating, setIsCreating] = useState(false);
	const isFirstRender = useRef(true);

	const canCreate = role === 'user' || role === 'admin';

	useEffect(() => {
		init(initialData);
	}, [initialData, init]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		fetchPage({ limit: LIMIT, skip, q: searchQuery });
	}, [skip, searchQuery, fetchPage]);

	const handleCreate = async (data: ProductFormData) => {
		setMutating(true);
		setError(null);
		const res = await createProductAction(data);
		if (res.ok) {
			addProduct(res.data);
			setIsCreating(false);
		} else {
			setError(res.error);
		}
		setMutating(false);
	};

	const handleUpdate = async (updated: ProductFormData & { id: number }) => {
		setMutating(true);
		setError(null);
		const { id, ...data } = updated;
		const res = await updateProductAction(id, data);
		if (res.ok) {
			updateProduct(res.data);
		} else {
			setError(res.error);
		}
		setMutating(false);
	};

	const handleDelete = async (id: number) => {
		setMutating(true);
		setError(null);
		const res = await deleteProductAction(id);
		if (res.ok) {
			removeProduct(id);
		} else {
			setError(res.error);
		}
		setMutating(false);
	};

	const displayedProducts =
		products.length > 0 || loading ? products : initialData.products;
	const displayedTotal =
		products.length > 0 || loading ? total : initialData.total;

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<SearchInput disabled={loading} onSearch={setSearchQuery} />
				{canCreate && (
					<button
						type="button"
						onClick={() => setIsCreating(prev => !prev)}
						className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
					>
						{isCreating ? 'Закрыть' : '+ Добавить товар'}
					</button>
				)}
			</div>

			{isMutating && (
				<div className="text-xs text-blue-600">Сохранение...</div>
			)}

			{error && <div className="text-sm text-red-600">{error}</div>}

			{isCreating && (
				<ProductForm
					submitLabel="Создать"
					disabled={isMutating}
					onSubmit={handleCreate}
					onCancel={() => setIsCreating(false)}
				/>
			)}

			{displayedProducts.length === 0 && !loading ? (
				<div className="py-10 text-center text-sm text-gray-500">
					Товары не найдены
				</div>
			) : (
				<div className={`space-y-2.5 ${loading ? 'opacity-50' : ''}`}>
					{displayedProducts.map(product => (
						<Product
							key={product.id}
							product={product}
							role={role}
							disabled={isMutating}
							onSave={handleUpdate}
							onDelete={handleDelete}
						/>
					))}
				</div>
			)}

			<Pagination
				skip={skip}
				limit={LIMIT}
				total={displayedTotal}
				disabled={loading}
				onChange={setSkip}
			/>
		</div>
	);
}
