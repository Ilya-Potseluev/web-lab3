import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
	title: 'Products',
	description: 'Управление каталогом товаров',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ru">
			<body className="bg-gray-50 text-gray-900 antialiased">
				<main className="mx-auto min-h-screen max-w-3xl space-y-5 p-6">
				<Header />
					{children}
				</main>
			</body>
		</html>
	);
}
