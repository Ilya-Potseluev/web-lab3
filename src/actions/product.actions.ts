'use server';

import { auth } from '@/auth';
import { createProduct, deleteProductById, updateProductById } from '@/lib/api';
import {
	productFormSchema,
	type IProduct,
	type ProductFormData,
} from '@/lib/schemas';
import { revalidateTag } from 'next/cache';

export type ActionResult<T> =
	| { ok: true; data: T }
	| { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createProductAction(
	rawData: ProductFormData
): Promise<ActionResult<IProduct>> {
	const session = await auth();
	if (!session?.user) {
		return { ok: false, error: '401: Необходима авторизация' };
	}

	const parsed = productFormSchema.safeParse(rawData);
	if (!parsed.success) {
		return {
			ok: false,
			error: 'Ошибка валидации данных',
			fieldErrors: parsed.error.flatten().fieldErrors as Record<
				string,
				string[]
			>,
		};
	}

	const created = await createProduct(parsed.data);
	revalidateTag('products', 'max');
	return { ok: true, data: { ...parsed.data, ...created } };
}

export async function updateProductAction(
	id: number,
	rawData: ProductFormData
): Promise<ActionResult<IProduct>> {
	const session = await auth();
	if (!session?.user) {
		return { ok: false, error: '401: Необходима авторизация' };
	}

	const parsed = productFormSchema.safeParse(rawData);
	if (!parsed.success) {
		return {
			ok: false,
			error: 'Ошибка валидации данных',
			fieldErrors: parsed.error.flatten().fieldErrors as Record<
				string,
				string[]
			>,
		};
	}

	const saved = await updateProductById(id, parsed.data);
	revalidateTag('products', 'max');
	revalidateTag(`product-${id}`, 'max');
	return { ok: true, data: saved };
}

export async function deleteProductAction(
	id: number
): Promise<ActionResult<number>> {
	const session = await auth();
	if (!session?.user) {
		return { ok: false, error: '401: Необходима авторизация' };
	}
	if (session.user.role !== 'admin') {
		return {
			ok: false,
			error: '403: Удаление доступно только администратору',
		};
	}

	await deleteProductById(id);
	revalidateTag('products', 'max');
	return { ok: true, data: id };
}
