import {VITE_API_BASE_URL_MFA} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const POST = async({cookies})=>{
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GFIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feeds`);
    }
    try{
        const response = await fetch(VITE_API_BASE_URL_MFA,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
        })
        if(!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('USSE Server: API Response:', responseData);  
        return json(responseData);
    }catch(err){
        console.log("MFAOPT-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}