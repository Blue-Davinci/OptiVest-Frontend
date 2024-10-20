// getGoalProgressions() is a dashboard dataservice helper that contacts our API endpoint
// to get the user's goal progressions.
const getGoalProgressions = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let goalProgressionURL = '/api/finmanager/goals/progression';
    try{
        const response = await fetchFunc(goalProgressionURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                success: false,
                status: response.status,
                error: errorData.error
            }
        }
        let responseData = await response.json();
        return {
            success: true,
            status: response.status,
            data: responseData
        }
    }catch(err){
        console.log("[ggpDS] ERROR: ", err.Error());
        return {
            success: false,
            status: 500,
            error: '[ggpDS]An error occured while fetching data'
        }
    }
}

 const getExpenseIncomeSummary  = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let expenseIncomeSummaryURL = '/api/finmanager/expense-income-summary';
    try{
        const response = await fetchFunc(expenseIncomeSummaryURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok){
            let errorData = await response.json();
            return {
                success: false,
                status: response.status,
                error: errorData.error
            }
        }
        let responseData = await response.json();
        return {
            success: true,
            status: response.status,
            data: responseData
        }
    }catch(err){
        console.log("[geisDS] ERROR: ", err.Error());
        return {
            success: false,
            status: 500,
            error: '[geisDS]An error occured while fetching data'
        }
    }
    
 }


export{
    getGoalProgressions,
    getExpenseIncomeSummary
}