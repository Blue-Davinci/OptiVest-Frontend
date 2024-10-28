import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
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
        console.log("[gpfsDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

const getAllStocks =  async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/investments/stocks';
    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let stockURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(stockURL, {
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
        console.log("[gsDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

const getAllBonds =  async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/investments/bonds';
    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let bondURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(bondURL, {
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
        console.log("[gbDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gbDS]An error occured while fetching data'
        }
    }
}

const getAllAlternativeInvestments =  async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/investments/alternative';
    let params = {
        name: name,
        page: page,
        page_size: page_size,
    }
    let alternativeURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(alternativeURL, {
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
        console.log("[gaDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gaDS]An error occured while fetching data'
        }
    }
}

const getInvestmentAnalysis = async({ fetch: customFetch } = {})=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let investmentAnalysisURL = '/api/investments/analysis';
    try{
        const response = await fetchFunc(investmentAnalysisURL, {
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
        console.log("[gaDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gpfsDS]An error occured while fetching data'
        }
    }
}

export{
    getInvestmentAnalysisSummary,
    getAllStocks,
    getAllBonds,
    getAllAlternativeInvestments,
    getInvestmentAnalysis
}