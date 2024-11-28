import {VITE_API_BASE_URL_ACCOUNT} from '$env/static/private';
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
        console.log('GBLEIP Server: API Response:', responseData);
        return {
            success: true,
            data: responseData
        };
    }catch(err){
        console.log("GAIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}
