import {getCreatedGroups} from '$lib/dataservice/groups/groupsDataService.js';

export const load = async ({ fetch }) => {
    try{
        let createdGroupsResponse = await getCreatedGroups({fetch});
        return {
            createdGroups: createdGroupsResponse
        }
    }catch(err){
        console.log('[gmLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gmLD]An error occured while fetching data'
        }
    }
}