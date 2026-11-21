'use client';

interface PaginationProps {
	skip: number;
	limit: number;
	total: number;
	disabled?: boolean;
	onChange: (newSkip: number) => void;
}

export function Pagination({
	skip,
	limit,
	total,
	disabled,
	onChange,
}: PaginationProps) {
	if (total <= limit) return null;

	return (
		<div className="flex items-center justify-between border-t pt-4 text-sm">
			<button
				type="button"
				disabled={disabled || skip === 0}
				onClick={() => onChange(Math.max(0, skip - limit))}
				className="disabled:opacity-40 rnd"
			>
				Назад
			</button>
			<span className="text-gray-600">
				{skip + 1}-{Math.min(skip + limit, total)} из {total}
			</span>
			<button
				type="button"
				disabled={disabled || skip + limit >= total}
				onClick={() => onChange(skip + limit)}
				className="disabled:opacity-40 rnd"
			>
				Вперёд
			</button>
		</div>
	);
}
