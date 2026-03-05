import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session?.user) {
		throw redirect(303, '/login');
	}

	if (!(session.user as any).emailVerified) {
		throw redirect(303, '/verify-email-required');
	}

	const role = (session.user as any).role ?? 'user';
	console.log('DEBUG: session role =', role, '| user =', session.user.email);
	return {
		user: session.user,
		role
	};
};
