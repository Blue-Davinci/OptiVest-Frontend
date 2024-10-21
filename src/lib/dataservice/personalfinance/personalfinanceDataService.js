
// getPersonalFinanceSumary() is an endpoint helper method that is responsible
// in getting the summaries of the user's investment portfolios.
// This should return the progressions of their bonds, stocks, and mutual funds.
const getPersonalFinanceSumary = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let personalFinanceSummaryURL = '/api/personalfinance/summary';
    try{
        const response = await fetchFunc(personalFinanceSummaryURL, {
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
        console.log("[gpfsDS] ERROR: ", err.Error());
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

export{
    getPersonalFinanceSumary
}