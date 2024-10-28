import {VITE_API_BASE_FEEDS_FAVORITES} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const POST = async({ cookies, request}) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('FFIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feeds`);
    }
    let {post_id, feed_id} = await request.json();

    try{
        let response = await fetch(`${VITE_API_BASE_FEEDS_FAVORITES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify({post_id, feed_id})
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('FFIEP Server: API Response:', responseData);
        return json(responseData);

    }catch(err){
        console.log("GFIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}

export const DELETE = async({ cookies, url}) => {
    let post_ID = url.searchParams.get('post_id');
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('FFIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feeds`);
    }
    let finalEndpoint = `${VITE_API_BASE_FEEDS_FAVORITES}/${post_ID}`;
    console.log('FFIEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('FFIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("FFIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}