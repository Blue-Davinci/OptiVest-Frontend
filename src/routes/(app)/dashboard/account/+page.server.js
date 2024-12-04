import {VITE_API_BASE_URL_ACCOUNT} from '$env/static/private';
import { avatarSchema } from '$lib/settings/schema.js';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail,message } from 'sveltekit-superforms';
import { checkAuthentication } from '$lib/helpers/auths';
import { redirect } from '@sveltejs/kit';

export const load = async ({fetch, cookies}) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/account`);
    }
    try{
        const response = await fetch(VITE_API_BASE_URL_ACCOUNT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            console.log('GAIP Error Server: API Response:', errorData);
            return {
                status: response.status,
                error: errorData.error
            };
        }
        let responseData = await response.json();
        let avatarForm = await superValidate(zod(avatarSchema));
        console.log('GBLEIP Server: API Response:', responseData);
        return {
            success: true,
            data: responseData,
            avatarForm
        };
    }catch(err){
        console.log("GAIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}

export const actions = {
    default: async ({request, cookies}) => {
        console.log('GAIP Server: Default Action'); 
        const formData = await request.formData();
        console.log('GAIP Server: Form Data:', formData);
        let avatarForm = await superValidate(formData, zod(avatarSchema));
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/account`);
        }
        if (!avatarForm.valid){
            console.log('GAIP Server ERROR Validation: Avatar Form:', avatarForm);
            return fail(400, { avatarForm });
        }
        console.log('GBLEIP Server: Avatar Form:', avatarForm);
        try{
            return message(avatarForm, 'Posted OK!');
        }catch(err){
            console.log("GAIP-AU-SE error: ", err);
            return {
                status: 500,
                error: "An error occured while updating data"
            };
        }
    }
}