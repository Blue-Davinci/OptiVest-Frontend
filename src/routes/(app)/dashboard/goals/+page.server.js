import {getGoalTrackingHistory} from '$lib/dataservice/goals/goalsDataService.js';
import {getGoalProgressions} from '$lib/dataservice/dashboard/goalsDataService.js';
import {getBudgetIDNames} from '$lib/dataservice/searchoptions/searchoptions.js';
import {VITE_API_BASE_GOALS} from  '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { superValidate, message, setError} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { goalSchema } from '$lib/settings/schema.js';
import { redirect } from '@sveltejs/kit';
import { fail} from '@sveltejs/kit';

export const load = async ({ fetch }) => {
    try{
        let goalDataResponse = await getGoalProgressions({fetch}, 0, 10, '');
        let goalsTrackingHistory = await getGoalTrackingHistory({fetch}, 0, 10, '');
        let budgetIDNames = await getBudgetIDNames({fetch});
        return {
            goalData: goalDataResponse,
            goalsTrackingHistory,
            budgetIDNames,
            form: await superValidate(zod(goalSchema))
        }
    }catch(err){
        console.log('[gthLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gthLD]An error occured while fetching data'
        }
    }
}

export const actions = {
    default : async ({request, cookies}) => {
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('[gthAC] User is not authenticated, REDIRECTING..');
            return redirect(303, `/login?redirectTo=/dashboard`);
        }
        const form = await superValidate(request, zod(goalSchema));
        if (!form.valid) {
            return fail(400,{form});
        }
        console.log('[gthAC] Form data:', form.data);
        try{
            const response = await fetch(VITE_API_BASE_GOALS, {
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
            return message(form,{
                message: 'Goal created successfully',
                data: responseData,
                success: true
            })
        }catch(err){
            console.log('[gthAC] ERROR:', err.message);
            return {
                status: 500,
                error: '[gthAC] An error occured while fetching data'
            }
        }
    }
}