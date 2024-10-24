
//import { error } from '@sveltejs/kit';
import {
    getGoalProgressions,
    getExpenseIncomeSummary
} from '$lib/dataservice/dashboard/goalsDataService.js';
import {getAllExpenses} from '$lib/dataservice/expenses/expenses.js';
import {getPersonalFinanceSumary} from '$lib/dataservice/personalfinance/personalfinanceDataService.js';

export const load = async ({fetch}) => {
    // get our auth
    try{
        let goalDataResponse = await getGoalProgressions({fetch});
        let expenseIncomeSummaryResponse = await getExpenseIncomeSummary({fetch});
        let expensesResponse = await getAllExpenses({fetch},0,10,'');
        let personalFinanceSummary = await getPersonalFinanceSumary({fetch});
        return {
            goalData: goalDataResponse, 
            expenseIncomeSummary: expenseIncomeSummaryResponse,
            expenses: expensesResponse,
            personalFinanceSummary: personalFinanceSummary
          };
            
    }catch(err){
        console.log("[dashLD] ERROR: ", err.message);
        return {
            status: 500,
            error: '[dashLD]An error occured while fetching data'
        }
    }
}