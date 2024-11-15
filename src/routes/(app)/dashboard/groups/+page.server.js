import {getGroups} from '$lib/dataservice/groups/groupsDataService.js';

export const load = async ({ fetch }) => {
    try{
        let createdGroupsResponse = await getGroups({fetch}); // isCreated is true by default
        let memberGroupsResponse = await getGroups({fetch}, false); // isCreated is false
        return {
            createdGroups: createdGroupsResponse,
            memberGroups: memberGroupsResponse
        }
    }catch(err){
        console.log('[gmLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gmLD]An error occured while fetching data'
        }
    }
}