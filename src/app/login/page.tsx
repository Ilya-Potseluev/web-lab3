import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await searchParams;

	async function loginAction(formData: FormData) {
		'use server';
		try {
			await signIn('credentials', {
				username: formData.get('username'),
				password: formData.get('password'),
				redirectTo: '/',
			});
		} catch (err) {
			if (err instanceof AuthError) {
				redirect('/login?error=Неверный логин или пароль');
			}
			throw err;
		}
	}

	return (
		<form
			action={loginAction}
			className="mx-auto max-w-sm space-y-4 rounded-lg border bg-white p-6 text-sm"
		>
			<h1 className="text-lg font-bold">Вход в систему</h1>
			<p className="text-xs text-gray-500">
				Доступные аккаунты: user / user или admin / admin
			</p>

			{error && (
				<div className="rounded bg-red-50 p-2.5 text-red-600">
					{error}
				</div>
			)}

			<input
				name="username"
				required
				placeholder="Логин"
				className="w-full rounded border px-3 py-2"
			/>
			<input
				name="password"
				type="password"
				required
				placeholder="Пароль"
				className="w-full rounded border px-3 py-2"
			/>

			<button
				type="submit"
				className="w-full rounded bg-blue-600 py-2 font-medium text-white"
			>
				Войти
			</button>
		</form>
	);
}
