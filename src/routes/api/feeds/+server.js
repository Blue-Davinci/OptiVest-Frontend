import {VITE_API_BASE_FEEDS} from '$env/static/private';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies, url }) => {
    let params = {
		name: url.searchParams.get('name'),
        is_educational: url.searchParams.get('is_educational'),
		page: url.searchParams.get('page'),
		page_size: url.searchParams.get('page_size')
	};
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GFIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/feeds`);
    }
    let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_FEEDS, params);
    console.log('GFIEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('GPFSIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GFIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}