
// getCurrencies() function returns the available currencies
const getCurrencies = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let currenciesURL = '/api/searchoptions/currency';

    try{
        const response = await fetchFunc(currenciesURL, {
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
        console.log("[gpfsDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

// getBudgetOptions() function returns the available budget categories
const getBudgetOptions = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let budgetCategoriesURL = '/api/searchoptions/budget-category';

    try{
        const response = await fetchFunc(budgetCategoriesURL, {
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
        console.log("[gpfsDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

const getBudgetIDNames = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let budgetIDNamesURL = '/api/searchoptions/budget-id-name';

    try{
        const response = await fetchFunc(budgetIDNamesURL, {
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
        console.log("[gpfsDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

export {
    getCurrencies,
    getBudgetOptions,
    getBudgetIDNames
}