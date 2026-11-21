import { create } from 'zustand';
import type { GetProductsResponse, IProduct } from '@/lib/api';

interface ProductsStore {
	products: IProduct[];
	total: number;
	skip: number;
	searchQuery: string;
	loading: boolean;
	isMutating: boolean;
	error: string | null;

	init: (data: GetProductsResponse) => void;
	setSkip: (skip: number) => void;
	setSearchQuery: (query: string) => void;

	fetchPage: (params: {
		limit: number;
		skip: number;
		q: string;
	}) => Promise<void>;

	addProduct: (product: IProduct) => void;
	updateProduct: (product: IProduct) => void;
	removeProduct: (id: number) => void;

	setMutating: (val: boolean) => void;
	setError: (err: string | null) => void;
}

export const useProductsStore = create<ProductsStore>(set => ({
	products: [],
	total: 0,
	skip: 0,
	searchQuery: '',
	loading: false,
	isMutating: false,
	error: null,

	init: data =>
		set({
			products: data.products,
			total: data.total,
			error: null,
		}),

	setSkip: skip => set({ skip }),
	setSearchQuery: searchQuery => set({ skip: 0, searchQuery }),

	fetchPage: async ({ limit, skip, q }) => {
		set({ loading: true, error: null });
		try {
			const params = new URLSearchParams({
				limit: String(limit),
				skip: String(skip),
				q,
			});
			const res = await fetch(`/api/products?${params}`);
			if (!res.ok) throw new Error('Ошибка загрузки');
			const data: GetProductsResponse = await res.json();
			set({ products: data.products, total: data.total });
		} catch (e) {
			set({ error: e instanceof Error ? e.message : 'Ошибка загрузки' });
		} finally {
			set({ loading: false });
		}
	},

	addProduct: product =>
		set(state => ({
			products: [product, ...state.products],
			total: state.total + 1,
		})),

	updateProduct: updated =>
		set(state => ({
			products: state.products.map(item =>
				item.id === updated.id ? updated : item
			),
		})),

	removeProduct: id =>
		set(state => ({
			products: state.products.filter(item => item.id !== id),
			total: Math.max(0, state.total - 1),
		})),

	setMutating: isMutating => set({ isMutating }),
	setError: error => set({ error }),
}));
