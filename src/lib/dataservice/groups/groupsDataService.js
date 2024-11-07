
// getGroups() function is used to fetch groups data from the server
// we pass in a custom fetch from the loader function in the page file
// we also pass a flag, isCreated, to determine if we want to fetch created groups or member groups
const getGroups = async({fetch: customFetch, isCreated = true} = {})=>{
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


export{
    getGroups
}