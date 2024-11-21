import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';

// getGroupComments() function is used to fetch group comments data from the server
// the associated_id will be the groupID while the associated_type will be 'group'
// we pass in a custom fetch from the loader function in the page file
const getGroupComments = async({fetch: customFetch}={}, associated_id, associated_type='group', page, page_size)=>{
    let fetchFunc = customFetch || fetch;
    let endpoint = '/api/comments';
    let params = {
        associated_id: associated_id,
        associated_type: associated_type,
        page: page,
        page_size: page_size
    }
    let groupURL = buildFeedFollowUrl(endpoint, params);
    console.log('Group URL:', groupURL);
    try{
        const response = await fetchFunc(groupURL, {
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
        console.log("[ggcDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[ggcDS]An error occured while fetching data'
        }
    }
}

const addGroupComment= async(content, associated_type, associated_id, parent_id = 0)=>{
    // make a post request to the server
    // perform the validation
    let endpoint = '/api/comments';
    let commentData;
    // if parent_id is not provided, we will assume it is a top level comment
    // and not include the parent_id in the request
    if (parent_id !== 0){
        commentData = {
            content: content,
            associated_type: associated_type,
            associated_id: associated_id,
            parent_id: parent_id
        }
    }else{
        commentData = {
            content: content,
            associated_type: associated_type,
            associated_id: associated_id
        }
    }
    console.log('Comment Data:', commentData);
    try{
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
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
        console.log("[agcDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[adCDS]An error occured while fetching data'
        }
    }
}

const deleteComment = async(commentID)=>{
    let params  = {
        commentID: commentID
    }
    let endpoint = buildFeedFollowUrl('/api/comments', params);
    console.log('Final Endpoint:', endpoint);
    try{
        const response = await fetch(endpoint, {
            method: 'DELETE',
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
        console.log("[dcDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[dcDS]An error occured while fetching data'
        }
    }
}

export {
    getGroupComments,
    addGroupComment,
    deleteComment
};