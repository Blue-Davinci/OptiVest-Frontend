import {VITE_API_BASE_URL_ACCOUNT} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const PATCH = async({cookies, request}) =>{
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GFIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feeds`);
    }
    // Get the data
    let userData = await request.json()
    console.log("Received Body:", userData)
    try{
        const response = await fetch(VITE_API_BASE_URL_ACCOUNT,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(userData)
        })
        if(!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('USSE Server: API Response:', responseData);  
        return json(responseData);    
    }catch(err){
        console.log("USSE-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}