import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';

const getAllIncomes = async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/finmanager/incomes';
    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let incomeURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(incomeURL, {
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
        console.log("[ggtDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[ggtDS]An error occured while fetching data'
        }
    }
}

export{
    getAllIncomes
}