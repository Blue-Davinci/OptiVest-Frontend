import { emailSchema } from '$lib/settings/schema.js';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VITE_API_BASE_URL_API_RECOVERY_INIT } from '$env/static/private';
import { fail } from '@sveltejs/kit';


export const load = async () => {
    return {
        form: await superValidate(zod(emailSchema))
    };
}

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(emailSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log(form.data);
		try {
			const response = await fetch(VITE_API_BASE_URL_API_RECOVERY_INIT, {
				method: 'POST',
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
				if (errorData.error.email) {
					return setError(form, 'email', errorData.error.email);
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
                message: 'if we found a matching email address, we have sent password reset instructions to it!',
                data: responseData.user,
                status: 'success'
            })
		} catch (error) {
			console.error('Fetch Error:', error);
			return fail(500, { form, error: 'An unexpected error occurred' });
		}
	}
};