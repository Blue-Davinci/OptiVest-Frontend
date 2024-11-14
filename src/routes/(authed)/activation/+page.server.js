import {VITE_API_BASE_URL_PASSWORD_RESEND_ACTIVATION} from  '$env/static/private';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { emailSchema } from '$lib/settings/schema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { fail} from '@sveltejs/kit';

export const load = async () => {
    return {
        form: await superValidate(zod(emailSchema))
    };
}

export const actions = {
    default: async({request}) => {
        const form = await superValidate(request, zod(emailSchema));
        if (!form.valid) {
          return fail(400,{form});
        }
        console.log('ACTIEP Server: Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_URL_PASSWORD_RESEND_ACTIVATION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // if it's an array, iterate over it and set the error for each field
                if (Array.isArray(errorData.error)){
                    for (let field in errorData.error){
                        setError(form, field, errorData.error[field]);
                    }
                }else{
                    return message(form, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return message(form, {
                success: true,
                message: responseData.message,
                data: responseData
            });
        } catch(err){
            console.log("ACTIEP-SE error: ", err);
            return {
                status: 500,
                error: "An error occured while submitting data"
            };
        }
    }
}