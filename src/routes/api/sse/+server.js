import {VITE_API_SSE_BASE_URL} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GPFSIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard`);
    }
    try{
        const response = await fetch(VITE_API_SSE_BASE_URL, {
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
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        })
    }catch(err){
        console.log("SSE-EP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}