
// getInvestmentAnalysisSummary() is a function that returns a summary of the investment analysis for a given user.
// This should return a previously analyzed AI response for the user's investment portfolios.
const getInvestmentAnalysisSummary = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let investmentAnalysisSummaryURL = '/api/investments/summary';
    try{
        const response = await fetchFunc(investmentAnalysisSummaryURL, {
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
    getInvestmentAnalysisSummary
}