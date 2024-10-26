import {VITE_API_BASE_INCOME} from '$env/static/private';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies, url }) => {
    let params = {
        name: url.searchParams.get('name'),
        page: url.searchParams.get('page'),
        page_size: url.searchParams.get('page_size')
    };
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/incomes`);
    }

    let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_INCOME, params);
    console.log('GIEP Server: User is authenticated, token: ', auth);
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
        console.log('GIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}