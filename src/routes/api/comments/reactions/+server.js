import {VITE_API_BASE_COMMENTS_REACTION} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const POST = async({ cookies, request }) => {
    // perform auth check
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('acrSE Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups?chat=true`);
    }
    // get comment data
    let commentData = await request.json();
    // build the final endpoint
    let finalEndpoint = `${VITE_API_BASE_COMMENTS_REACTION}`;
    console.log('acrSE Server: Final Endpoint:', finalEndpoint);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(commentData)
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('acrSE Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("acrSE-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}

export const DELETE = async({ cookies, url }) => {
    // get the commentID from the request
    let commentID = url.searchParams.get('commentID');
    // cjeck if the commentID is provided
    if (!commentID){
        return json({error: 'No comment ID provided'}, {status: 400});
    }
    // perform auth check
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('dcrSE Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups?chat=true`);
    }
    // build the final endpoint
    let finalEndpoint = `${VITE_API_BASE_COMMENTS_REACTION}/${commentID}`;
    console.log('dcrSE Server: Final Endpoint:', finalEndpoint);
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
        console.log('dcrSE Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("dcrSE-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}