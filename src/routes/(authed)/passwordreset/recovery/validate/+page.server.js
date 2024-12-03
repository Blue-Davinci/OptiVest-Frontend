import { recoverySchema } from '$lib/settings/schema.js';
import {VITE_API_BASE_URL_USERS_RECOVERY_VERIFICATION} from '$env/static/private';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
//import { VITE_API_BASE_URL_USERS_RECOVERY_VERIFICATION } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    return {
        form: await superValidate(zod(recoverySchema))
    };
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const form = await superValidate(formData, zod(recoverySchema));
        
        if (!form.valid) {
            return fail(400, { form });
        }

        // Extract recovery codes
        const recovery_codes = [];
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('code-')) {
                if (!value || value.trim() === '') {
                    return message(
                        form,
                        {
                            message: 'Recovery codes cannot be empty',
                            status: 'failure'
                        },
                        {
                            status: 403
                        }
                    );
                }
                recovery_codes.push(value.trim());
            }
        }
        let payload = {
            token_plaintext: form.data.token_plaintext,
            recovery_codes
        };
        console.log('Payload:', payload);
        // perform request
        try{
            const response = await fetch(VITE_API_BASE_URL_USERS_RECOVERY_VERIFICATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
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
            const responseData = await response.json();
            console.log('API Response:', responseData);
            return message(form, {
                message: 'Password reset successful!',
                data: responseData.user,
                status: 'success'
            });
        } catch (error) {
            console.error('Fetch Error:', error);
            return fail(500, { form, error: 'An unexpected error occurred' });
        }
    }
};
