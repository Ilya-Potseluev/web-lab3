import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export const proxy = auth(req => {
	const isLoggedIn = Boolean(req.auth);
	if (!isLoggedIn && req.nextUrl.pathname.startsWith('/products/new')) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}
	return NextResponse.next();
});

export const config = {
	matcher: ['/products/new/:path*'],
};
