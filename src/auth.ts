import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { UserRole } from '@/lib/schemas';

const USERS = [
	{
		id: '1',
		name: 'Обычный пользователь',
		username: 'user',
		password: 'user',
		role: 'user' as UserRole,
	},
	{
		id: '2',
		name: 'Администратор',
		username: 'admin',
		password: 'admin',
		role: 'admin' as UserRole,
	},
];

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				username: { label: 'Логин', type: 'text' },
				password: { label: 'Пароль', type: 'password' },
			},
			authorize(credentials) {
				const found = USERS.find(
					u =>
						u.username === credentials?.username &&
						u.password === credentials?.password
				);
				if (!found) return null;
				return { id: found.id, name: found.name, role: found.role };
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user?.role) token.role = user.role;
			return token;
		},
		session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub ?? '';
				session.user.role = (token.role as UserRole) ?? 'user';
			}
			return session;
		},
	},
	pages: {
		signIn: '/login',
	},
});
