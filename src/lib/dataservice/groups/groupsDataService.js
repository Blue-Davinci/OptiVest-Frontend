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

const getGroupExpenses = async({fetch: customFetch}, groupID, categoryName, page, page_size)=>{
    console.log('Group ID:', groupID);
    let fetchFunc = customFetch || fetch;
    let endpoint = '/api/groups/expenses';
    let params = {
        groupID: groupID,
        name: categoryName,
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
        console.log("[ggeDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[ggeDS]An error occured while fetching data'
        }
    }
}

const inviteMembers = async(groupID, inviteeEmail)=>{
    let finalEndpoint = '/api/groups/invitation';
    try{
        const response = await fetch(finalEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: groupID,
                invitee_user_email: inviteeEmail
            })
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
        console.log("[imDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gimDS]An error occured while fetching data'
        }
    }
}

const acceptInvite = async(groupID, inviteeEmail, status)=>{
    let finalEndpoint = `/api/groups/invitation?groupID=${groupID}`;
    try{
        const response = await fetch(finalEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                invitee_email: inviteeEmail,
                status: status
            })
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
        console.log("[aiDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gaiDS]An error occured while fetching data'
        }
    }
}

// deletGroupMember() accepts a groupID and a userID and is_admin flag
// if is_admin is true, means the admin has initiated the request
// and it will delete the user from the group sending the groupID and userID as parameters
// if is_admin is false, it means that a member has initiated the delete and only the groupID is sent
const deleteGroupMember = async(groupID, userID, is_admin)=>{
    let finalEndpoint;
    if (is_admin){
        let params = {
            groupID: groupID,
            userID: userID,
            is_admin: true
        }
        finalEndpoint = buildFeedFollowUrl('/api/groups/member', params);
    }else{
        let params = {
            groupID: groupID,
            is_admin: false
        };
        finalEndpoint = buildFeedFollowUrl('/api/groups/member', params);
    }
    try{
        const response = await fetch(finalEndpoint, {
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
        console.log("[dgmDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[dgmDS]An error occured while fetching data'
        }
    }
}

const updateUserRole = async(groupID, userID, role)=>{ 
    // check if items are provided
    if (!groupID || !userID || !role){
        return {
            success: false,
            status: 400,
            error: "Invalid data provided"
        }
    }
    // build a singiluar param:groupID
    let params = {
        groupID: groupID
    }
    let finalEndpoint = buildFeedFollowUrl('/api/groups/member', params);
    try{
        const response = await fetch(finalEndpoint, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userID,
                role: role
            })
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
        console.log("[uURDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[uURDS]An error occured while fetching data'
        }
    }


}

export{
    getGroups,
    getGroupTransactions,
    getGroupExpenses,
    inviteMembers,
    acceptInvite,
    deleteGroupMember,
    updateUserRole
}