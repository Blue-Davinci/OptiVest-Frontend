import {getFeeds} from '$lib/dataservice/feeds/feedsDataService.js';

export const load = async ({ fetch }) => {
    try {
        let feedDataResponse = await getFeeds({ fetch }, 0, 0, '', '');
        return {
            feedData: feedDataResponse
        };
    } catch (err) {
        console.log('[gfLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gfLD]An error occured while fetching data'
        };
    }
}