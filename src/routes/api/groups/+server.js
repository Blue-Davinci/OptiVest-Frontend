import {VITE_API_BASE_GROUPS} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups`);
    }
    try{
        const response = await fetch(VITE_API_BASE_GROUPS, {
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
        return json(responseData);
    } catch(err){
        console.log("GG-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}