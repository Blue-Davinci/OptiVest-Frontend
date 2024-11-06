
const getCreatedGroups = async({fetch: customFetch} = {})=>{
    let fetchFunc = customFetch || fetch;
    let endpoint = '/api/groups';
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
    getCreatedGroups
}