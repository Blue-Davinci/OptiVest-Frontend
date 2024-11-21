import {VITE_API_BASE_COMMENTS} from '$env/static/private';
import {commentSchema} from  '$lib/settings/schema.js';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies, url }) => {
    // associated_id, associated_type, page, page_size
    let params ={
        associated_id: url.searchParams.get('associated_id'),
        associated_type: url.searchParams.get('associated_type'),
        page: url.searchParams.get('page'),
        page_size: url.searchParams.get('page_size')
    }
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GCEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/${params.associated_id}`);
    }
    let finalEndpoint = buildFeedFollowUrl(`${VITE_API_BASE_COMMENTS}`, params);
    console.log('GCEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('GCEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GCEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }

}

export const POST = async({ cookies, request }) => {
    // perform auth check
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGMEMEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups?chat=true`);
    }
    // get comment data
    let commentData = await request.json();
    // perform the validation
    try{
        commentSchema.parse(commentData);
    }catch(err){
        const fieldErrors = err.flatten();
        return json({error: fieldErrors}, {status: 400});
    }
    // build the final endpoint
    let finalEndpoint = `${VITE_API_BASE_COMMENTS}`;
    console.log('ACEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('ACEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("ACEP-SE error: ", err);
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
        console.log('DCEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups?chat=true`);
    }
    // build the final endpoint
    let finalEndpoint = `${VITE_API_BASE_COMMENTS}/${commentID}`;
    console.log('DCEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('DCEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("DCEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}
