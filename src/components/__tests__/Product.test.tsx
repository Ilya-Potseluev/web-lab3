import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Product } from '../Product';

const mockProduct = {
	id: 42,
	title: 'Механическая клавиатура',
	description: 'Беспроводная клавиатура с подсветкой',
	category: 'accessories',
	price: 99,
	stock: 15,
	rating: 4.8,
};

describe('Product', () => {
	it('отображает переданные данные и разворачивает описание по клику', async () => {
		const user = userEvent.setup();
		render(
			<Product
				product={mockProduct}
				onSave={vi.fn()}
				onDelete={vi.fn()}
			/>
		);

		expect(screen.getByText('#42')).toBeInTheDocument();
		expect(screen.getByText('Механическая клавиатура')).toBeInTheDocument();
		expect(
			screen.queryByText(mockProduct.description)
		).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Открыть' }));
		expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
	});

	it('обычный пользователь (user) видит редактирование, но не видит удаление', async () => {
		const user = userEvent.setup();
		render(
			<Product
				product={mockProduct}
				role="user"
				onSave={vi.fn()}
				onDelete={vi.fn()}
			/>
		);

		expect(
			screen.queryByRole('button', { name: 'Удалить' })
		).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Открыть' }));
		expect(
			screen.getByRole('button', { name: 'Редактировать' })
		).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: 'Удалить' })
		).not.toBeInTheDocument();
	});

	it('администратор (admin) видит кнопку удаления и может вызвать её', async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();

		render(
			<Product
				product={mockProduct}
				role="admin"
				onSave={vi.fn()}
				onDelete={onDelete}
			/>
		);

		const deleteBtn = screen.getByRole('button', { name: 'Удалить' });
		expect(deleteBtn).toBeInTheDocument();

		await user.click(deleteBtn);
		expect(onDelete).toHaveBeenCalledWith(42);
	});
});
