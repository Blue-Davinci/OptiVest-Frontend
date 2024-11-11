import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';
// getGroups() function is used to fetch groups data from the server
// we pass in a custom fetch from the loader function in the page file
// we also pass a flag, isCreated, to determine if we want to fetch created groups or member groups
const getGroups = async({fetch: customFetch}, isCreated = true)=>{
    let fetchFunc = customFetch || fetch;
    let endpoint;
    if (isCreated){
        endpoint = '/api/groups?is_created=true';
    }else{
        endpoint = '/api/groups?is_created=false';
    }
    try{
        const response = await fetchFunc(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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
        console.log("[gcgDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gcgDS]An error occured while fetching data'
        }
    }
}

// getGroupTransactions() function is used to fetch group transactions data from the server
// we pass in a custom fetch from the loader function in the page file
const getGroupTransactions = async({fetch: customFetch}, groupID, goalID, page, page_size)=>{
    console.log('Group ID:', groupID);
    let fetchFunc = customFetch || fetch;
    let endpoint = '/api/groups/transactions';
    let params = {
        groupID: groupID,
        goalID: goalID,
        page: page,
        page_size: page_size
    }
    let groupURL = buildFeedFollowUrl(endpoint, params);
    console.log('Group URL:', groupURL);
    try{
        const response = await fetchFunc(groupURL, {
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
    getGroups,
    getGroupTransactions
}