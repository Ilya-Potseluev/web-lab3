'use client';

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="rounded-lg border border-red-200 bg-white p-6 text-center text-sm">
			<p className="mb-3 text-red-600">{error.message}</p>
			<button
				type="button"
				onClick={reset}
				className="rounded bg-blue-600 px-4 py-1.5 text-white"
			>
				Повторить
			</button>
		</div>
	);
}
