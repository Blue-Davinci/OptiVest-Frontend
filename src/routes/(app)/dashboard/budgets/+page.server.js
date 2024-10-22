import {VITE_API_BASE_BUDGETS} from  '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { redirect } from '@sveltejs/kit';

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
            data: responseData
        };
    }catch(err){
        console.log("GBLEIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}