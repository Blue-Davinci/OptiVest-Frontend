import { deleteAuthentication } from '$lib/helpers/auths';
import { checkAuthentication } from '$lib/helpers/auths';
import { VITE_API_BASE_URL_LOGOUT } from '$env/static/private';
import { redirect, error } from '@sveltejs/kit';

export const actions = {
	default: async ({ fetch, cookies }) => {
		// get the token before
		const auth = checkAuthentication(cookies).user;
		if (!auth) {
			return redirect(303, `/login?redirectTo=/dashboard`);
		}
		// proceed to send a logout request to the logout endpoint
		// if the request is successful, delete the auth cookie
		try {
			const response = await fetch(VITE_API_BASE_URL_LOGOUT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth}`
				}
			});
			// check if the response is ok, if not, throw an error
			if (!response.ok) {
				let errorData = await response.json();
				console.log('Error while logging out', errorData);
				error(400, {
					description: 'an error occurred while processing your request',
					error: errorData
				});
			}
		} catch (err) {
			console.log('LOG-SE Error while logging out', err);
			error(500, {
				description: 'an error occurred while processing your request',
				error: 'could not log user out'
			});
		}
		// delete the auth cookie
		// if the response is ok, delete the authentication cookie
		if (deleteAuthentication(cookies)) {
			console.log('logging out...');
			// redirect to the home page
			return redirect(303, '/');
		} else {
			error(400, {
				description: 'an error occurred while processing your request',
				error: 'could not log user out'
			});
		}
	}
};
