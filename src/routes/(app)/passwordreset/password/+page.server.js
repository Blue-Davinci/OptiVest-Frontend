// passwordConfrimPasswordSchema //
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { passworSchema } from '$lib/settings/schema.js';
import { VITE_API_BASE_URL_UPDATE_PASSWORD } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const token = url.searchParams.get('token');
	return {
		form: await superValidate(zod(passworSchema)),
		token
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(passworSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		console.log("Form Data Recieved: ", form);
		// Remove confirm_password from form.data
		delete form.data.confirm_password;
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log(form.data);

		try {
			const response = await fetch(VITE_API_BASE_URL_UPDATE_PASSWORD, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData);
				// check if error is due to email or due to password and
				// set the error accordingly: { error: { email: 'must be a valid email address' } }
				if (errorData.error.password) {
					return setError(form, 'email', errorData.error.password);
				} else if (errorData.error.token) {
					return setError(form, 'token', errorData.error.token);
				} else {
					return message(
						form,
						{
							message: errorData.error.message,
							status: 'failure'
						},
						{
							status: 403
						}
					);
				}
			}

			const responseData = await response.json();
			console.log('API Response:', responseData);
			return message(form, {
				message: 'Password reset successful!',
				data: responseData.message,
				status: 'success'
			});
		} catch (error) {
			console.error('Fetch Error:', error);
			return fail(500, { form, error: 'An unexpected error occurred' });
		}
	}
};
