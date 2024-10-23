import {VITE_API_BASE_BUDGETS} from '$env/static/private';
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
        console.log('GBGET Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/budgets`);
    }
    let finalEndpoint = buildFeedFollowUrl(VITE_API_BASE_BUDGETS, params);
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
        //console.log('GBGET Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("GBGET-SE error: ", err);
        return json({error: "An error occured while fetching data"});
    }
}

export const DELETE = async({ cookies, url }) => {
    // get budget ID from URL
    let budgetID = url.searchParams.get('budgetID');
    let auth = checkAuthentication(cookies).user;
    if (!auth){
        console.log('GBDEP Server: User is not authenticated, REDIRECTING..');
        return redirect(303, `/login?redirectTo=/dashboard/budgets`);
    }
    // check budget id is a valid number and not 0
    if (!budgetID || isNaN(budgetID) || budgetID == 0){
        return json({error: "Invalid budget ID"}, {status: 400});
    }
    // send the delete request
    let finalEndpoint = `${VITE_API_BASE_BUDGETS}/${budgetID}`;

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
        // we'll get a message back
        let responseData = await response.json();
        //console.log('DBSE Server: API Response:', responseData);
        return json(responseData);
    }catch(err){
        console.log("DBSE-SE error: ", err);
        return json({error: "An error occured while deleting data"});
    }

}