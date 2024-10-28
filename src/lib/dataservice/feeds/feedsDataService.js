import {buildFeedFollowUrl} from '$lib/helpers/utilities.js';

const getFeeds = async({ fetch: customFetch } = {}, page = 0, page_size = 0, name = '',is_educational='')=>{
    let fetchFunc = customFetch || fetch; // Use custom fetch if provided, else use global fetch
    let endpoint = '/api/feeds';
    let params = {
        name: name,
        page: page,
        page_size: page_size,
        is_educational: is_educational
    }
    let feedURL = buildFeedFollowUrl(endpoint, params);
    try{
        const response = await fetchFunc(feedURL, {
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
        console.log("[gfDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gfDS]An error occured while fetching data'
        }
    }
};

const addPostToFavorite = async(post_id, feed_id)=>{
    let endpoint = '/api/feeds/follows';
    if (!post_id || !feed_id) {
        return {
            success: false,
            status: 400,
            error: 'Invalid post_id or feed_id'
        }
    }
    try{
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({post_id, feed_id})
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
        console.log("[gfDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gfDS]An error occured while fetching data'
        }
    }
}

const removePostFromFavorite = async(post_id)=>{
    let endpoint = `/api/feeds/follows?post_id=${post_id}`;
    if (!post_id) {
        return {
            success: false,
            status: 400,
            error: 'Invalid post_id'
        }
    }
    try{
        const response = await fetch(endpoint, {
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
        console.log("[gfDS] ERROR: ", err.message);
        return {
            success: false,
            status: 500,
            error: '[gfDS]An error occured while fetching data'
        }
    }
}


export{
    getFeeds,
    addPostToFavorite,
    removePostFromFavorite
}