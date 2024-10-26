import {getAllRecurringExpenses, getAllExpenses} from '$lib/dataservice/expenses/expensesDataService.js';
import {getBudgetIDNames} from '$lib/dataservice/searchoptions/searchoptions.js';
import {VITE_API_BASE_EXPENSES_RECURRING} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { expenseSchema } from '$lib/settings/schema.js';
import { redirect } from '@sveltejs/kit';
import { fail} from '@sveltejs/kit';

export const load = async ({ fetch }) => {
    try{
        let expensesResponse = await getAllExpenses({fetch}, 0, 10, '');
        let recurringExpensesResponse = await getAllRecurringExpenses({fetch}, 0, 10, '');
        return {
            expenses: expensesResponse,
            recurringExpenses: recurringExpensesResponse,
            form: await superValidate(zod(expenseSchema)),
            budgetIDNames: await getBudgetIDNames({fetch})
        }
    }catch(err){
        console.log('[geLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[geLD]An error occured while fetching data'
        }
    }
}

export const actions = {
    default : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[geAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard`);
        }
        const form = await superValidate(request, zod(expenseSchema));
        if (!form.valid) {
            return fail(400,{form});
        }
        //console.log('[geAC] Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_EXPENSES_RECURRING, {
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
                message : "recuring expense saved successfully",
                data: responseData,
                success : true
            });
        }catch(err){
            console.log('[geAC] ERROR: ', err.message);
            return message(form, {
                message: 'An error occured while saving the expense',
                type: 'error'
            });
        }
    }
}