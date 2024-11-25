import {VITE_API_BASE_URL_CONTACT_US} from '$env/static/private';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { contactSchema } from '$lib/settings/schema.js';
import { fail} from '@sveltejs/kit';


export const load = async () => {
    try{
        return {
            form: await superValidate(zod(contactSchema))
        };
    }catch(err){
        console.log("CNU-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}

export const actions = {
    default: async({request}) => {
        const form = await superValidate(request, zod(contactSchema));
        if (!form.valid) {
            console.log('CNU Server: Form is invalid:', form);
            return fail(400,{form});
        }
        console.log('CNU Server: Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_URL_CONTACT_US, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                message: 'Your message was sent successfully',
                data: responseData.data,
                success: true
            });
        }catch(err){
            console.log("CNU-SE error: ", err);
            return {
                status: 500,
                error: "An error occured while sending your message"
            };
        }
    }
}