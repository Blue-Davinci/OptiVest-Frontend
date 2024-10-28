import {VITE_API_BASE_FEEDS} from '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { redirect } from '@sveltejs/kit';


export const load = async ({ params, cookies }) => {
    const postID = params.id;
    console.log('postID: ', postID);
    let auth = checkAuthentication(cookies).user;
    if (!auth) {
         return redirect(303, `/login?redirectTo=/dashboard/feeds/${postID}`);
    }
    let finalEndpoint = `${VITE_API_BASE_FEEDS}/${postID}`;
    try{
        const response = await fetch(finalEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            }
        });
        // if not successful
        if (!response.ok) {
            return {
                status: response.status,
                error: response.statusText
            };
        }
        // if successful
        const responseData = await response.json(); 
        return {
            status: response.status,
            feedData: responseData
        };
    }catch(err){
        console.log('[gfLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gfLD]An error occured while fetching data'
        };
    }
}