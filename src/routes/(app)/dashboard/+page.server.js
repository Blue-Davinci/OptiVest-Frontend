
//import { error } from '@sveltejs/kit';
import {
    getGoalProgressions,
    getExpenseIncomeSummary

} from '$lib/dataservice/dashboard/goalsDataService.js';

export const load = async ({fetch}) => {
    // get our auth
    try{
        let goalDataResponse = await getGoalProgressions({fetch});
        let expenseIncomeSummaryResponse = await getExpenseIncomeSummary({fetch});
        return {
            goalData: goalDataResponse, 
            expenseIncomeSummary: expenseIncomeSummaryResponse
          };
            
    }catch(err){
        console.log("[ggpDS] ERROR: ", err.Error());
        return {
            status: 500,
            error: '[ggpDS]An error occured while fetching data'
        }
    }
}