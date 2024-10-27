import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
import {VITE_API_BASE_INVESTMENTS_BONDS} from '$env/static/private';
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
        console.log('GBEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
    }
    let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_INVESTMENTS_BONDS, params);
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
        //console.log('GPFSIEP Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GB-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}

export const DELETE = async({ cookies, url }) => {
    let bondID = url.searchParams.get('bondID');
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GBEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/investment-portfolio`);
    }
    if (!bondID || isNaN(bondID) || bondID == 0){
        return json({error: "Invalid bond ID"}, {status: 400});
    }
    let finalEndpoint = `${VITE_API_BASE_INVESTMENTS_BONDS}/${bondID}`;
    try{
        let response = await fetch(finalEndpoint, {
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
        return json({success: true});
    }catch(err){
        console.log("GB-SE error: ", err);
        return json({error: "An error occured while deleting data"});
    }
}