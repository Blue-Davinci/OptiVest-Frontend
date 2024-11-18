import {VITE_API_BASE_GROUPS_MEMBER} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const DELETE = async({ cookies, url }) => {
    // is_admin will be used to determine if we will perform a user delete or an admin delete
    // admin delete we will send the groupid and the userid of the user to be deleted
    // the url should be in the form of /groups/member/:groupid/:userid
    // for a user delete we will only send the groupid
    // the url should be in the form of /groups/member/:groupid
    let params = {
        groupID: url.searchParams.get('groupID'), 
        userID: url.searchParams.get('userID')
    };
    let is_admin = url.searchParams.get('is_admin') === "true" ;
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/${params.groupID}`);
    }
    // make the final endpoint based on the is_admin value
    let finalEndpoint = is_admin ? `${VITE_API_BASE_GROUPS_MEMBER}/${params.groupID}/${params.userID}` : `${VITE_API_BASE_GROUPS_MEMBER}/${params.groupID}`;
    console.log('GGEP Server: finalEndpoint: ', finalEndpoint);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'DELETE',
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

export const PATCH = async({ cookies, url, request }) => {
    // we will get the groupID from the URL
    // the body should contain the user_id and the role which we will send to the server
    let params = url.searchParams.get('groupID');
    // check if params is provided and a number
    if (!params || isNaN(params)){
        return json({error: "Invalid groupID provided"});
    }
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/${params}`);
    }
    let {user_id, role} = await request.json();
    let finalEndpoint = `${VITE_API_BASE_GROUPS_MEMBER}/${params}`;
    console.log('UPREP Server: finalEndpoint: ', finalEndpoint);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify({user_id, role})
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        return json(responseData);
    }catch(err){
        console.log("UPREP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }

}