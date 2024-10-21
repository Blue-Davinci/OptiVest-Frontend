
//import { error } from '@sveltejs/kit';
import {
    getGoalProgressions,
    getExpenseIncomeSummary
} from '$lib/dataservice/dashboard/goalsDataService.js';
import {getAllExpenses} from '$lib/dataservice/expenses/expenses.js';

export const load = async ({fetch}) => {
    // get our auth
    try{
        let goalDataResponse = await getGoalProgressions({fetch});
        let expenseIncomeSummaryResponse = await getExpenseIncomeSummary({fetch});
        let expensesResponse = await getAllExpenses({fetch},0,10,'');
        return {
            goalData: goalDataResponse, 
            expenseIncomeSummary: expenseIncomeSummaryResponse,
            expenses: expensesResponse
          };
            
    }catch(err){
        console.log("[ggpDS] ERROR: ", err.Error());
        return {
            status: 500,
            error: '[ggpDS]An error occured while fetching data'
        }
    }
}