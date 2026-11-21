import Link from 'next/link';
import { auth, signOut } from '@/auth';

export async function Header() {
	const session = await auth();

	return (
		<header className="border-b bg-white">
			<div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 text-sm">
				<Link href="/" className="text-lg font-bold">
					Products
				</Link>

				{session?.user ? (
					<div className="flex items-center gap-3">
						<span>
							{session.user.name} (<b>{session.user.role}</b>)
						</span>
						<form
							action={async () => {
								'use server';
								await signOut({ redirectTo: '/' });
							}}
						>
							<button
								type="submit"
								className="text-red-600 hover:underline"
							>
								Выйти
							</button>
						</form>
					</div>
				) : (
					<Link
						href="/login"
						className="text-blue-600 hover:underline"
					>
						Войти
					</Link>
				)}
			</div>
		</header>
	);
}
