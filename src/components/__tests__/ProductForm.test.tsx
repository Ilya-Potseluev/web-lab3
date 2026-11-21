import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProductForm } from '../ProductForm';

describe('ProductForm', () => {
	it('отображает переданные начальные данные товара', () => {
		render(
			<ProductForm
				initialData={{
					title: 'Тестовый телефон',
					description: 'Подробное описание смартфона',
					category: 'electronics',
					price: 500,
					stock: 10,
					rating: 4.5,
				}}
				onSubmit={vi.fn()}
			/>
		);

		expect(screen.getByPlaceholderText('Название')).toHaveValue(
			'Тестовый телефон'
		);
		expect(screen.getByPlaceholderText('Категория')).toHaveValue(
			'electronics'
		);
		expect(screen.getByPlaceholderText('Цена')).toHaveValue(500);
		expect(screen.getByPlaceholderText('Остаток')).toHaveValue(10);
	});

	it('показывает сообщения Zod при неверном вводе', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();

		render(<ProductForm onSubmit={onSubmit} />);

		await user.type(screen.getByPlaceholderText('Название'), 'АБ');
		await user.type(screen.getByPlaceholderText('Описание'), 'Коротко');
		await user.click(screen.getByRole('button', { name: /сохранить/i }));

		expect(
			await screen.findByText(/минимум 3 символа/i)
		).toBeInTheDocument();
		expect(screen.getByText(/минимум 10 символов/i)).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('показывает ошибку правила предметной области: дорогой товар без остатка', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();

		render(<ProductForm onSubmit={onSubmit} />);

		await user.type(
			screen.getByPlaceholderText('Название'),
			'Премиум товар'
		);
		await user.type(
			screen.getByPlaceholderText('Описание'),
			'Очень подробное описание товара'
		);
		await user.type(screen.getByPlaceholderText('Категория'), 'luxury');
		await user.type(screen.getByPlaceholderText('Цена'), '1500');
		await user.clear(screen.getByPlaceholderText('Остаток'));
		await user.type(screen.getByPlaceholderText('Остаток'), '0');

		await user.click(screen.getByRole('button', { name: /сохранить/i }));

		expect(await screen.findByText(/дороже \$1000/i)).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('вызывает onSubmit с валидными данными при корректном вводе', async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();

		render(<ProductForm onSubmit={onSubmit} />);

		await user.type(screen.getByPlaceholderText('Название'), 'Ноутбук Pro');
		await user.type(
			screen.getByPlaceholderText('Описание'),
			'Мощный ноутбук для работы'
		);
		await user.type(screen.getByPlaceholderText('Категория'), 'laptops');
		await user.type(screen.getByPlaceholderText('Цена'), '1200');
		await user.clear(screen.getByPlaceholderText('Остаток'));
		await user.type(screen.getByPlaceholderText('Остаток'), '5');

		await user.click(screen.getByRole('button', { name: /сохранить/i }));

		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect(onSubmit).toHaveBeenCalledWith({
			title: 'Ноутбук Pro',
			description: 'Мощный ноутбук для работы',
			category: 'laptops',
			price: 1200,
			stock: 5,
			rating: 5,
		});
	});
});
