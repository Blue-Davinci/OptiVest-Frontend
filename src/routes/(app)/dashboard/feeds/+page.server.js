import {getFeeds} from '$lib/dataservice/feeds/feedsDataService.js';

export const load = async ({ fetch, url }) => {
    try {
        let is_educational = url.searchParams.get('is_educational');
        let feedDataResponse 
        // if is_educational is true, fetch educational feeds else fetch all feeds
        if(is_educational === 'true'){
            feedDataResponse = await getFeeds({ fetch }, 0, 0, '', 'true');;
        }else{
            feedDataResponse = await getFeeds({ fetch }, 0, 0, '');
        }
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