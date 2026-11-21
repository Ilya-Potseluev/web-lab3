import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="py-10 text-center text-sm">
			<p className="mb-2 text-gray-600">Товар не найден</p>
			<Link href="/" className="text-blue-600 hover:underline">
				Вернуться на главную
			</Link>
		</div>
	);
}
