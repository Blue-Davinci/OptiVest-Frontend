import { getAllDebts } from '$lib/dataservice/debts/debtDataService.js';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { checkAuthentication } from '$lib/helpers/auths';
import {VITE_API_BASE_DEBTS} from '$env/static/private';
import { fail} from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { debtSchema, debtInstallmentSchema } from '$lib/settings/schema.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	try {
		let debtsResponse = await getAllDebts({ fetch }, 0, 10, '');
        let debtForm = await superValidate(zod(debtSchema));
        let debtInstallmentForm = await superValidate(zod(debtInstallmentSchema));  
		return {
			debtsResponse,
			debtForm,
            debtInstallmentForm
		};
	} catch (err) {
		console.log('[debLD] ERROR: ', err.message);
		return {
			status: 500,
			error: '[debLD]An error occured while fetching data'
		};
	}
};

export const actions = {
	newdebt: async ({ request, cookies }) => {
		const debtForm = await superValidate(request, zod(debtSchema));
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard/debts`);
        }
		if (!debtForm.valid) {
			return fail(400, { debtForm });
		}
        try{
            const response = await fetch(VITE_API_BASE_DEBTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth}`
                },
                body: JSON.stringify(debtForm.data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (Array.isArray(errorData.error)) {
                    // If errorData.error is an array, iterate over it and set the error for each field
                    for (let field in errorData.error) {
                        setError(debtForm, field, errorData.error[field]);
                    }
                } else {
                    // If it's not an array, handle it directly as an object
                    return message(debtForm, {
                        message: errorData.error,
                        success: false
                    });
                }
            }
            let responseData = await response.json();
            return message(debtForm,{
                message: 'Debt created successfully',
                data: responseData.data,
                success: true
            })

        }catch(err){
            console.log('[debts/+page.server.js] ERROR: ', err.message);
            return fail(500, { debtForm, error: 'An unexpected error occurred' });
	    }
    }
}
