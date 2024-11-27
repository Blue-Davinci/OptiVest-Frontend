import {getPublicGroups} from '$lib/dataservice/groups/groupsDataService';
//import { checkAuthentication } from '$lib/helpers/auths';
//import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {

    try {
        let groupsResponse = await getPublicGroups({ fetch },0, 10);
        return {
            groupsResponse
        };
    } catch (err) {
        console.log('[gpgLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gpgLD]An error occured while fetching data'
        };
    }
}