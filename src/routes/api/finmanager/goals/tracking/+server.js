import {VITE_API_BASE_GOALS_TRACKING} from '$env/static/private';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, url }) => {
    let params = {
		name: url.searchParams.get('name'),
		page: url.searchParams.get('page'),
		page_size: url.searchParams.get('page_size')
	};
        // get our bearer token
        let auth = checkAuthentication(cookies).user;
        if (!auth){
            console.log('GTEP Server: User is not authenticated, REDIRECTING..');
            return redirect (303, `/login?redirectTo=/dashboard/goals`);
        }
        // print token
        console.log('GTEP Server: User is authenticated, token: ', auth);
        // final endpoint
        let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_GOALS_TRACKING, params);
        // perform the fetch
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
            //console.log('GPEP Server: API Response:', responseData);
            return json(responseData);
        }catch(err){
            console.log("GT-SE error: ", err);
            return json({error: "An error occured while fetching data"});
        }
}