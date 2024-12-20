import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/settings/schema.js';
import { fail } from '@sveltejs/kit';
import { VITE_API_BASE_URL_LOGIN } from '$env/static/private';
import { saveAuthentication } from '$lib/helpers/auths.js';

export const load = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log(form.data);
		// Handle successful form submission here (e.g., saving data)
		try {
			const response = await fetch(VITE_API_BASE_URL_LOGIN, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});
			console.log('Login URL: ', VITE_API_BASE_URL_LOGIN);
			if (!response.ok) {
				const errorData = await response.json();
				console.error('API Error:', errorData, 'Response status: ', response.status);
				// check if error is due to email or due to password and
				// set the error accordingly: { error: { email: 'must be a valid email address' } }
				if (Array.isArray(errorData.error)) {
					for (let field in errorData.error) {
						setError(form, field, errorData.error[field]);
					}
				} else {
					// if we get a 423 status code, we know that the user is not activated so we redirect them to the activation page
					if (response.status === 423) {
						return message(
							form,
							{
								message: 'activation_required',
								success: false
							},
							{
								status: 403
							}
						);
					}
					// if we get a 403 forbidden status code, we know the user is authed but requires MFA so we redirect them to the MFA page
					if (response.status === 403) {
						return message(
							form,
							{
								message: 'mfa_required',
								token: errorData.totp_token,
								email: errorData.email,
								success: false
							},
							{
								status: 403
							}
						);
					}
					// check if error is an object
					if (typeof errorData.error === 'object' && errorData.error !== null) {
						for (let field in errorData.error) {
							setError(form, field, errorData.error[field]);
						}
					} else {
						return message(
							form,
							{
								message: errorData.error,
								success: false
							},
							{
								status: 401
							}
						);
					}
				}
			}

			const responseData = await response.json();
			console.log('API Response:', responseData);
			let isSuccesfulAuth = saveAuthentication(cookies, responseData.api_key, responseData.user);
			if (isSuccesfulAuth) {
				//successfulAuth();
				// console.log('[page.server.js] LOGIN Url Path: ', redirectTo);
				return message(form, {
					message: 'Login successful!',
					data: responseData.user,
					success: true
				});
			} else {
				return setError(form, 'password', 'could not persist user');
			}
		} catch (error) {
			console.error('Fetch Error:', error);
			return message(
				form,
				{
					message: 'An unexpected error occurred and we could not log you in',
					success: false
				},
				{
					status: 403
				}
			);
		}
	}
};
