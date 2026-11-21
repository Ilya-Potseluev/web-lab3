import 'server-only';

export type { IProduct, GetProductsResponse, ProductFormData } from './schemas';

import {
	getProductsResponseSchema,
	productSchema,
	type GetProductsResponse,
	type IProduct,
	type ProductFormData,
} from './schemas';

const selectedFields = [
	'title',
	'description',
	'category',
	'price',
	'stock',
	'rating',
];

export interface GetProductsParams {
	limit?: number;
	skip?: number;
	q?: string;
}

export async function getProducts(
	params: GetProductsParams
): Promise<GetProductsResponse> {
	const param = params.q ? '/search' : '';
	const search = new URLSearchParams({
		limit: String(params.limit ?? 10),
		skip: String(params.skip ?? 0),
		select: selectedFields.join(','),
		...(params.q ? { q: params.q } : {}),
	});
	const raw = await fetchJson(
		`https://dummyjson.com/products${param}?${search}`
	);
	return getProductsResponseSchema.parse(raw);
}

export async function getProductById(id: number): Promise<IProduct> {
	const raw = await fetchJson(
		`https://dummyjson.com/products/${id}?` +
			new URLSearchParams({ select: selectedFields.join(',') })
	);
	return productSchema.parse(raw);
}

export async function updateProductById(
	id: number,
	fields: Partial<ProductFormData>
): Promise<IProduct> {
	const raw = await fetchJson(
		`https://dummyjson.com/products/${id}?` +
			new URLSearchParams({ select: selectedFields.join(',') }),
		'PUT',
		fields
	);
	return productSchema.parse(raw);
}

export async function createProduct(
	fields: ProductFormData
): Promise<IProduct> {
	const raw = await fetchJson(
		`https://dummyjson.com/products/add?` +
			new URLSearchParams({ select: selectedFields.join(',') }),
		'POST',
		fields
	);
	return productSchema.parse(raw);
}

export async function deleteProductById(
	id: number
): Promise<IProduct & { isDeleted: true }> {
	return fetchJson(
		`https://dummyjson.com/products/${id}?` +
			new URLSearchParams({ select: selectedFields.join(',') }),
		'DELETE'
	);
}

async function fetchJson(
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
	body?: Record<string, unknown>
) {
	const res = await fetch(url, {
		method,
		next:
			method === 'GET'
				? { revalidate: 60, tags: ['products'] }
				: undefined,
		...(body
			? {
					body: JSON.stringify(body),
					headers: { 'Content-Type': 'application/json' },
				}
			: {}),
	});

	if (!res.ok) throw new Error(`Ошибка API: ${res.status}`);
	return res.json();
}
