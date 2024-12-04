import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { passwordResetSchema } from '$lib/settings/schema.js';
import { fail } from '@sveltejs/kit';
import { VITE_API_BASE_URL_PASSWORD_INITIAL } from '$env/static/private';

export const load = async () => {
	return {
		form: await superValidate(zod(passwordResetSchema))
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(passwordResetSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log(form.data);
		// Handle successful form submission here (e.g., saving data)
		try {
			const response = await fetch(VITE_API_BASE_URL_PASSWORD_INITIAL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData);
				// if error = "invalid authentication credentials" then we know the user has TOTP enabled
				// so we will return a message with mfa_enabled to display the token input field
				if (errorData.error === 'invalid or missing authentication token') {
					return message(
						form,
						{
							message: 'mfa_enabled',
							success: false
						},
						{
							status: 403
						}
					);
				}
				// check if error is due to email or due to password and
				// set the error accordingly: { error: { email: 'must be a valid email address' } }
				if (typeof errorData.error === 'object' && errorData.error !== null) {
					for (let field in errorData.error) {
						setError(form, field, errorData.error[field]);
					}
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
			console.log('PRI-SE API Response:', responseData);
            return message(form, {
                message: 'if we found a matching email address, we have sent password reset instructions to it!',
                data: responseData.user,
                status: 'success'
            })
		} catch (error) {
			console.error('PRI-SE-Fetch Error:', error);
			return fail(500, { form, error: 'An unexpected error occurred' });
		}
	}
};
