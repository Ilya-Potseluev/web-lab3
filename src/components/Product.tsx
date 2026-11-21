import { useState } from 'react';
import Link from 'next/link';
import type { IProduct, UserRole } from '@/lib/schemas';
import { ProductForm } from './ProductForm';

interface ProductProps {
	product: IProduct;
	role?: UserRole;
	disabled?: boolean;
	onSave: (product: IProduct) => void;
	onDelete: (id: number) => void;
}

export function Product({
	product,
	role,
	disabled,
	onSave,
	onDelete,
}: ProductProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const canEdit = role === 'user' || role === 'admin';
	const canDelete = role === 'admin';

	if (isEditing && canEdit) {
		return (
			<ProductForm
				initialData={product}
				disabled={disabled}
				onSubmit={data => {
					onSave({ ...data, id: product.id });
					setIsEditing(false);
				}}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="rounded-lg border bg-white px-4 py-2.5 text-sm">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 truncate">
					<span className="font-mono text-xs text-gray-500">
						#{product.id}
						{isExpanded && ` · ${product.category}`}
					</span>
					<Link
						href={`/products/${product.id}`}
						className={`${isExpanded ? 'text-base font-semibold' : 'truncate font-medium'} hover:underline`}
					>
						{product.title}
					</Link>
				</div>

				<div className="flex shrink-0 gap-2">
					<button
						type="button"
						onClick={() => setIsExpanded(prev => !prev)}
						className="text-blue-600 hover:underline"
					>
						{isExpanded ? 'Свернуть' : 'Открыть'}
					</button>
					{!isExpanded && canDelete && (
						<button
							type="button"
							disabled={disabled}
							onClick={() => onDelete(product.id)}
							className="text-red-600 hover:underline disabled:opacity-40"
						>
							Удалить
						</button>
					)}
				</div>
			</div>

			{isExpanded && (
				<div className="mt-3 space-y-3">
					<p className="text-gray-600">{product.description}</p>

					<div className="flex gap-4 text-xs text-gray-700">
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

					{(canEdit || canDelete) && (
						<div className="flex justify-end gap-3 border-t pt-2.5">
							{canEdit && (
								<button
									type="button"
									disabled={disabled}
									onClick={() => setIsEditing(true)}
									className="text-blue-600 hover:underline disabled:opacity-40"
								>
									Редактировать
								</button>
							)}
							{canDelete && (
								<button
									type="button"
									disabled={disabled}
									onClick={() => onDelete(product.id)}
									className="text-red-600 hover:underline disabled:opacity-40"
								>
									Удалить
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
