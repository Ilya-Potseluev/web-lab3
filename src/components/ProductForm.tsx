'use client';

import { useState } from 'react';
import { productFormSchema, type ProductFormData } from '@/lib/schemas';

interface ProductFormProps {
	initialData?: ProductFormData;
	submitLabel?: string;
	disabled?: boolean;
	onSubmit: (data: ProductFormData) => void;
	onCancel?: () => void;
}

const emptyData: ProductFormData = {
	title: '',
	description: '',
	category: '',
	price: 0,
	stock: 0,
	rating: 5,
};

export function ProductForm({
	initialData = emptyData,
	submitLabel = 'Сохранить',
	disabled = false,
	onSubmit,
	onCancel,
}: ProductFormProps) {
	const [form, setForm] = useState<ProductFormData>(initialData);
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = e => {
		e.preventDefault();
		const parsed = productFormSchema.safeParse(form);
		if (!parsed.success) {
			setErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
			return;
		}
		setErrors({});
		onSubmit(parsed.data);
	};

	return (
		<form
			onSubmit={handleSubmit}
			noValidate
			className="space-y-3 rounded-lg border border-blue-400 bg-white p-4 text-sm"
		>
			<div>
				<input
					disabled={disabled}
					value={form.title}
					onChange={e => setForm({ ...form, title: e.target.value })}
					placeholder="Название"
					className="w-full"
				/>
				{errors.title && (
					<p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>
				)}
			</div>

			<div>
				<textarea
					disabled={disabled}
					value={form.description}
					onChange={e => setForm({ ...form, description: e.target.value })}
					placeholder="Описание"
					className="w-full"
				/>
				{errors.description && (
					<p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
				<div>
					<input
						disabled={disabled}
						value={form.category}
						onChange={e => setForm({ ...form, category: e.target.value })}
						placeholder="Категория"
					/>
					{errors.category && (
						<p className="mt-1 text-xs text-red-600">{errors.category[0]}</p>
					)}
				</div>
				<div>
					<input
						disabled={disabled}
						type="number"
						step="0.01"
						value={form.price || ''}
						onChange={e => setForm({ ...form, price: +e.target.value })}
						placeholder="Цена"
					/>
					{errors.price && (
						<p className="mt-1 text-xs text-red-600">{errors.price[0]}</p>
					)}
				</div>
				<div>
					<input
						disabled={disabled}
						type="number"
						value={form.stock || ''}
						onChange={e => setForm({ ...form, stock: +e.target.value })}
						placeholder="Остаток"
					/>
					{errors.stock && (
						<p className="mt-1 text-xs text-red-600">{errors.stock[0]}</p>
					)}
				</div>
				<div>
					<input
						disabled={disabled}
						type="number"
						step="0.1"
						min="0"
						max="5"
						value={form.rating}
						onChange={e => setForm({ ...form, rating: +e.target.value })}
						placeholder="Рейтинг"
					/>
					{errors.rating && (
						<p className="mt-1 text-xs text-red-600">{errors.rating[0]}</p>
					)}
				</div>
			</div>

			<div className="flex justify-end gap-2">
				{onCancel && (
					<button
						className="rnd"
						type="button"
						disabled={disabled}
						onClick={onCancel}
					>
						Отмена
					</button>
				)}
				<button
					type="submit"
					disabled={disabled}
					className="bg-blue-600 text-white rnd"
				>
					{submitLabel}
				</button>
			</div>
		</form>
	);
}
