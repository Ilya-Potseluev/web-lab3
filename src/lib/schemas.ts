import { z } from 'zod';

export const productFormSchema = z
	.object({
		title: z
			.string()
			.trim()
			.min(3, 'Название должно содержать минимум 3 символа'),
		description: z
			.string()
			.trim()
			.min(10, 'Описание должно содержать минимум 10 символов'),
		category: z.string().trim().min(2, 'Укажите категорию'),
		price: z.coerce.number().positive('Цена должна быть больше 0'),
		stock: z.coerce
			.number()
			.int('Остаток должен быть целым числом')
			.min(0, 'Остаток не может быть отрицательным'),
		rating: z.coerce
			.number()
			.min(0, 'Рейтинг: минимум 0')
			.max(5, 'Рейтинг: максимум 5'),
	})
	.refine(data => !(data.price > 1000 && data.stock === 0), {
		message: 'Дорогой товар (дороже $1000) должен быть в наличии на складе',
		path: ['stock'],
	});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const productSchema = productFormSchema.extend({
	id: z.number(),
});

export type IProduct = z.infer<typeof productSchema>;

export const getProductsResponseSchema = z.object({
	products: z.array(productSchema),
	total: z.number(),
	skip: z.number(),
	limit: z.number(),
});

export type GetProductsResponse = z.infer<typeof getProductsResponseSchema>;

export const searchParamsSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(10),
	skip: z.coerce.number().int().min(0).default(0),
	q: z.string().default(''),
});

export type UserRole = 'user' | 'admin';
