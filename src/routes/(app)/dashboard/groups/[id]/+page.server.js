import {VITE_API_BASE_GROUPS} from  '$env/static/private';
import { checkAuthentication } from '$lib/helpers/auths';
import { redirect } from '@sveltejs/kit';

export const load = async ({fetch, params, cookies}) => {
    try{
        const auth = checkAuthentication(cookies).user;
        if (!auth) {
            return redirect(303, `/login?redirectTo=/admin/feeds`);
        }
        // check for a searchOption parameter
        let groupID = params.id;
        // if groupID is empty, return an {}
        if(!groupID){
            return {
                status: 404,
                data: {}
            }
        }
        // fetch group data
        const response = await fetch(`${VITE_API_BASE_GROUPS}/${groupID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth}`
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                status: response.status,
                error: errorData.error
            };
        }
        let responseData = await response.json();
        return {
            status: 200,
            data: responseData
        };

    }catch(err){
        console.log("GBLEIP-SE error: ", err);
        return {
            status: 500,
            error: "An error occured while fetching data"
        };
    }
}