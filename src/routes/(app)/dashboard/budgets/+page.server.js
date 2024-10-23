import {VITE_API_BASE_BUDGETS} from  '$env/static/private';
import {getCurrencies, getBudgetOptions} from '$lib/dataservice/searchoptions/searchoptions';
import { checkAuthentication } from '$lib/helpers/auths';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { budgetSchema } from '$lib/settings/schema.js';
import { redirect } from '@sveltejs/kit';
import { fail} from '@sveltejs/kit';

export const load = async ({fetch, cookies}) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard`);
    }
    let finalEndpoint = VITE_API_BASE_BUDGETS;
    console.log('GBLEIP Server: User is authenticated, token: ', auth);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                success: false,
                status: response.status,
                error: errorData.error
            };
        }
        let responseData = await response.json();
        console.log('GBLEIP Server: API Response:', responseData);
        return {
            success: true,
            data: responseData,
            form: await superValidate(zod(budgetSchema)),
            currencies: await getCurrencies({fetch}),
            budgetCategories: await getBudgetOptions({fetch})
        };
    }catch(err){
        console.log("GBLEIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}

export const actions = {
    default: async({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard`);
        }
        const form = await superValidate(request, zod(budgetSchema));
        if (!form.valid) {
          return fail(400,{form});
        }
        console.log('GBLEIP Server: Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_BUDGETS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(form.data)
            });
            if (!response.ok){
                let errorData = await response.json();
                // for every field in the error object, set the error
                // in the form object
                for (let field in errorData.error){
                    setError(form, field, errorData.error[field]);
                }
                return fail(400, {form});
            }
            let responseData = await response.json();
            return message(form, {
                message: 'Budget created successfully!',
                data: responseData,
                status: 'success'
            });
            
        }catch(err){
            console.log('GBLEIP-SE error: ', err);
            return {
                status: 500,
                error: "An error occured while submitting data"
            };
        }
    }
}