import {VITE_API_BASE_INCOME} from '$env/static/private';
import {getCurrencies} from '$lib/dataservice/searchoptions/searchoptions';
import {getAllIncomes} from '$lib/dataservice/incomes/incomeDataService.js';
import {incomeSchema} from '$lib/settings/schema.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { fail} from '@sveltejs/kit';

export const load = async ({ fetch }) => {
    try{
        let incomeDataResponse = await getAllIncomes({fetch}, 0, 10, '');
        return {
            incomeData: incomeDataResponse,
            currencies: await getCurrencies({fetch}),
            form: await superValidate(zod(incomeSchema))
        }
    }catch(err){
        console.log('[giLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gthLD]An error occured while fetching data'
        }
    }
}

export const actions ={
    default : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[giAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/incomes`);
        }
        const form = await superValidate(request, zod(incomeSchema));
        if (!form.valid) {
            return fail(400,{form});
        }
        //console.log('[gthAC] Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_INCOME, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
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
                message: 'Income added successfully',
                data: responseData,
                success: true
            });
        }catch(err){
            console.log('[giAC] ERROR: ', err.message);
            return {
                status: 500,
                error: '[gthAC]An error occured while adding income'
            }
        }
    }
}