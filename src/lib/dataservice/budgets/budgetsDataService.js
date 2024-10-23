
const deleteBudgetByBudgetID = async (budgetID) => {
    let endpoint = `/api/finmanager/budgets?budgetID=${budgetID}`;
    try{
        let response = await fetch(endpoint, {
            method: 'DELETE',
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
        console.log("[gaeDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gaeDS]An error occured while deleting data'
        }
    }
}

export{
    deleteBudgetByBudgetID
}