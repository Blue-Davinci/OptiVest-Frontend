import {VITE_API_BASE_GROUPS_CREATED, VITE_API_BASE_GROUPS} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies, url }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups`);
    }
    // get is_created query
    let is_created = url.searchParams.get('is_created');
    let finalEndpoint = is_created === "true" ? VITE_API_BASE_GROUPS_CREATED : VITE_API_BASE_GROUPS;
    console.log('GGEP Server: finalEndpoint: ', finalEndpoint);
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
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        return json(responseData);
    } catch(err){
        console.log("GG-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}