import {VITE_API_BASE_GROUPS_PUBLIC} from '$env/static/private';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

// This route supports name and page/page-size query parameters
export const GET = async({cookies, url}) => {
    let params = {
        name: url.searchParams.get('name'),
        page: url.searchParams.get('page'),
        page_size: url.searchParams.get('page_size')
    }
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GPG Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/public`);
    }
    let finalEndpoint = buildFeedFollowUrl(`${VITE_API_BASE_GROUPS_PUBLIC}`, params);
    console.log('GGEXEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('GPG Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GPG-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}

// This is the join Public Group POST endpoint
export const POST = async({cookies,request})=>{
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GPG Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/public`);
    }
    let inviteRequest = await request.json();
    console.log('GPG Server: Invite Request:', inviteRequest);
    try{
        const response = await fetch(`${VITE_API_BASE_GROUPS_PUBLIC}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(inviteRequest)
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('GPG Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GPG-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}