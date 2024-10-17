import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { VITE_API_BASE_URL_SIGNUP } from '$env/static/private';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { signUpFormSchema } from '$lib/settings/schema.js';
//import { fail} from '@sveltejs/kit';
//import { VITE_API_BASE_URL_LOGIN } from '$env/static/private';
//import { saveAuthentication } from '$lib/helpers/auths.js';

export const load = async () => {
	return {
		form: await superValidate(zod(signUpFormSchema))
	};
};

export const actions = {
	default: async ({request}) => {
		const form = await superValidate(request, zod(signUpFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		console.log(form.data);
        // Remove confirm_password from form.data
        delete form.data.confirm_password;
		// Handle successful form submission here (e.g., saving data)
		try {
			const response = await fetch(VITE_API_BASE_URL_SIGNUP, {
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
				} else if (errorData.error.first_name) {
					return setError(form, 'first_name', errorData.error.first_name);
				} else if (errorData.error.last_name) {
					return setError(form, 'last_name', errorData.error.last_name);
				} else if (errorData.error.phone_number) {
					return setError(form, 'phone_number', errorData.error.phone_number);
				} else if (errorData.error.password) {
					return setError(form, 'password', errorData.error.password);
				} else {
					return message(
						form,
						{
							message: errorData.error,
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
                message: 'Signup successful!',
                data: responseData.user,
                status: 'success'
            })
		} catch (error) {
			console.error('Fetch Error:', error);
			return fail(500, { form, error: 'An unexpected error occurred' });
		}
	}
};
