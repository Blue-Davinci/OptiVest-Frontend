import {VITE_API_BASE_GROUPS_TRANSACTIONS} from '$env/static/private';
import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async({ cookies, url }) => {
    let params = {
        goalID : url.searchParams.get('goalID'),
        page: url.searchParams.get('page'),
		page_size: url.searchParams.get('page_size')
    };
    let groupID =  url.searchParams.get('groupID');
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GGTEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/groups/${groupID}`);
    }
    console.log("Group ID: ", groupID);
    let finalEndpoint = buildFeedFollowUrl(`${VITE_API_BASE_GROUPS_TRANSACTIONS}/${groupID}`, params);
    console.log('GGTEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('GGTSIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GGT-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}