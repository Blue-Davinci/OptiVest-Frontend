
import {VITE_API_BASE_PERSONAL_FINANCE_EXPENSE_INCOME_SUMMARY} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies }) => {
    // get our bearer token
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GEIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feedmanager`);
    }
    // print token
    console.log('GEIEP Server: User is authenticated, token: ', auth);
    // perform the fetch
    try{
        const response = await fetch(VITE_API_BASE_PERSONAL_FINANCE_EXPENSE_INCOME_SUMMARY, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('GPEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GEIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}