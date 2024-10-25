import {getGoalTrackingHistory} from '$lib/dataservice/goals/goalsDataService.js';
import {getGoalProgressions} from '$lib/dataservice/dashboard/goalsDataService.js';

export const load = async ({ fetch }) => {
    try{
        let goalDataResponse = await getGoalProgressions({fetch}, 0, 10, '');
        let goalsTrackingHistory = await getGoalTrackingHistory({fetch}, 0, 10, '');
        return {
            goalData: goalDataResponse,
            goalsTrackingHistory
        }
    }catch(err){
        console.log('[gthLD] ERROR: ', err.message);
        return {
            status: 500,
            error: '[gthLD]An error occured while fetching data'
        }
    }
}