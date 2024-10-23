import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';

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

const getAllBudgetInformation = async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/finmanager/budgets';

    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let budgetURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(budgetURL, {
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
        console.log("[gaeDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gaeDS]An error occured while fetching data'
        }
    }

}

export{
    deleteBudgetByBudgetID,
    getAllBudgetInformation
}