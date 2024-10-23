import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
// getAllExpenses() is an expense and dashboard dataservice helper that contacts our API endpoint
// to get all expenses. This endpoint also supports paginaation as well as a search parameter.
const getAllExpenses  = async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/finmanager/expenses';

    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let expenseURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(expenseURL, {
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
    getAllExpenses
}