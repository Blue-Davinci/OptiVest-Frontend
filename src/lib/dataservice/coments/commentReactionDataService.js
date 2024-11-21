import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';

const addCommentReaction = async(comment_id)=>{
    // make a post request to the server
    let endpoint = '/api/comments/reactions';
    let reactionData = {
        comment_id: comment_id
    }
    console.log("Comment Reaction Data:", reactionData);
    try{
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reactionData)
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
        console.log("[acRDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[acRDS]An error occured while fetching data'
        }
    }
}

const deleteCommentReaction = async(comment_id)=>{
    let params = {
        commentID: comment_id
    }
    let endpoint = buildFeedFollowUrl('/api/comments/reactions', params);
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
        console.log("[dcrDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[dcrDS]An error occured while fetching data'
        }
    }
}

export{
    addCommentReaction,
    deleteCommentReaction
}