import {VITE_API_BASE_GROUPS_INVITE} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const POST = async({ cookies, request }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups`);
    }
    // get group_id and invitee_user_email from the request
    const { group_id, invitee_user_email } = await request.json();
    let finalEndpoint = VITE_API_BASE_GROUPS_INVITE;
    try{
        const response = await fetch(finalEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify({ group_id, invitee_user_email })

        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        return json(responseData);
    } catch(err){
        console.log("POI-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}


export const PATCH = async({ cookies, request, url }) => {
    // check if user is authenticated
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('PI Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups`);
    }
    // groupID
    let groupID = url.searchParams.get('groupID');
    // get invitee_email and status which can only be accepted or declined
    const { invitee_email, status } = await request.json();
    // fincal endpoint
    let finalEndpoint = `${VITE_API_BASE_GROUPS_INVITE}/${groupID}`;
    console.log("finalEndpoint: ", finalEndpoint);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify({ invitee_email, status })
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        return json(responseData);
    }catch(err){
        console.log("PI-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}