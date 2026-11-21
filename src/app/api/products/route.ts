import { getProducts } from '@/lib/api';
import { searchParamsSchema } from '@/lib/schemas';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	const parsed = searchParamsSchema.safeParse({
		limit: request.nextUrl.searchParams.get('limit') ?? undefined,
		skip: request.nextUrl.searchParams.get('skip') ?? undefined,
		q: request.nextUrl.searchParams.get('q') ?? undefined,
	});

	if (!parsed.success) {
		return NextResponse.json(
			{ message: 'Некорректные параметры запроса' },
			{ status: 400 }
		);
	}

	try {
		const data = await getProducts(parsed.data);
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json(
			{
				message:
					error instanceof Error ? error.message : 'Ошибка сервера',
			},
			{ status: 500 }
		);
	}
}
