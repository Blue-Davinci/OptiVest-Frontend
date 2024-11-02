import { VITE_API_BASE_NOTIFICATIONS } from '$env/static/private';
import { buildFeedFollowUrl } from '$lib/helpers/utilities.js';
import { checkAuthentication } from '$lib/helpers/auths';
import { json, redirect } from '@sveltejs/kit';

export const GET = async ({ cookies, url }) => {
	let params = {
		name: url.searchParams.get('name'),

		page: url.searchParams.get('page'),
		page_size: url.searchParams.get('page_size')
	};
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GNIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/notifications`);
    }
    let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_NOTIFICATIONS, params);
    console.log('GNEP Server: Final Endpoint:', finalEndpoint);
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
        console.log('GNEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GNIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
};


export const PATCH = async ({ cookies, url, request }) => {
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('PNIEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/notifications`);
    }
    let notificationID = url.searchParams.get('notificationID');
    let finalEndpoint = `${VITE_API_BASE_NOTIFICATIONS}/${notificationID}`;
    let status =  await request.json();
    console.log('PNIEP Server: Final Endpoint:', finalEndpoint);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth}`
            },
            body: JSON.stringify(status)
        });
        if (!response.ok){
            let errorData = await response.json();
            return json({error: errorData.error}, {status: response.status});
        }
        let responseData = await response.json();
        console.log('PNIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("PNIEP-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}