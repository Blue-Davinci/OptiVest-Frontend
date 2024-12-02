import {totpSchema, totpSecondarySchema} from '$lib/settings/schema.js';
import { saveAuthentication } from '$lib/helpers/auths.js';
import {VITE_API_BASE_URL_LOGIN_VERIFY} from '$env/static/private';
import { superValidate,  message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail} from '@sveltejs/kit';

export const load = async () => {
    return {
        form: await superValidate(zod(totpSchema))
    };
}

export const actions = {
    default: async({request, cookies}) => {
        const formData = await request.formData();
        const errorMessage = "Incorrect data provided. Please try refreshing the page or login again"
        // get form data for the hidden fields
        const form = await superValidate(formData, zod(totpSchema));
        if (!form.valid){
            return fail(400, {form});
        }
        // validate secondary totp data just incase
        try {
			const result = totpSecondarySchema.parse(Object.fromEntries(formData));
			console.log(result);
		} catch (err) {
            console.log('TOTP error: ', err)
			return message(
                form,
                {
                    message: errorMessage,
                    success: false
                },
                {
                    status: 401
                }
            )
		}
        const payload = {
            email : formData.get('email'),
            totp_token: formData.get('totp_token'),
            totp_code: form.data.totp_code
        }
        console.log('Form Data: ',formData, " -- ", payload);
        try{
            const response = await fetch(VITE_API_BASE_URL_LOGIN_VERIFY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok){
                const errorData = await response.json();
                // if status is 401, check if it contains = session expired or not found. please log in again
                // if it does, return a message for a direct redirect to /login
                if (response.status === 401){
                    if (errorData.error === 'session expired or not found. please log in again'){
                        console.log('Session expired or not found. Please log in again');
                        return message(
                            form,
                            {
                                message: 'session_expired',
                                success: false
                            },
                            {
                                status: 401
                            }
                        )
                    }
                }
                console.error('API Error:', errorData, 'Response status: ', response.status);
                if (Array.isArray(errorData.error)){
                    return message(
                        form,
                        {
                            message: errorMessage,
                            success: false
                        },
                        {
                            status: 401
                        }
                    )
                }else{
                    setError(form, 'error', errorData.error);
                }
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
        }catch(err){
            console.log('GBLEIP-SE error: ', err);
            return {
                status: 500,
                error: "An error occured while submitting data"
            };
        }
    }
}  