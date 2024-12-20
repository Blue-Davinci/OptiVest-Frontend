import {VITE_API_BASE_SEARCH_OPTIONS_BUDGET_ID_NAMES}  from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';


export const GET = async({ cookies }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GPFSIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard`);
    }
    try{
        const response = await fetch(VITE_API_BASE_SEARCH_OPTIONS_BUDGET_ID_NAMES, {
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
        //console.log('GPFSIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("SOC-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}